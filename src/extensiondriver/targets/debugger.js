/**
 * Debugger attached to particular target
 */

const thenChrome = require('then-chrome');
const Channel = require('chnl');
const logger = require('../../utils/logger').create('Debugger');

// see: https://chromedevtools.github.io/debugger-protocol-viewer/1-2/
const PROTOCOL_VERSION = '1.2';

module.exports = class Debugger {

  constructor () {
    this._target = null;
    this._onEvent = this._onEvent.bind(this);
    this._onDetach = this._onDetach.bind(this);
    this.onEvent = new Channel();
  }

  attach(target) {
    return thenChrome.debugger.attach(target, PROTOCOL_VERSION)
      .then(() => this._afterAttach(target))
      .catch(e => prettyError(e, 'attach'));
  }

  sendCommand(name, params = {}) {
    logger.log(`Debugger command ${name}`, params);
    return thenChrome.debugger.sendCommand(this._target, name, params)
      .then(res => {
        logger.log(`Response to '${name}'`, res);
        return res;
      })
      .catch(e => prettyError(e, name, params));
  }

  detach() {
    // debugger can be automatically detached when target closes.
    // In that case second call of detach() should not fail
    if (this._target) {
      return thenChrome.debugger.detach(this._target)
        .then(() => this._afterDetach('self'))
        .catch(e => prettyError(e, 'detach'));
    } else {
      return Promise.resolve();
    }
  }

  getTarget() {
    return this._target;
  }

  isAttachedTo(target) {
    if (!this._target || !target) {
      return false;
    }
    const sameTabId = this._target.tabId && this._target.tabId === target.tabId;
    const sameExtensionId = this._target.extensionId && this._target.extensionId === target.extensionId;
    return sameTabId || sameExtensionId;
  }

  _getTargetStr() {
    return JSON.stringify(this._target);
  }

  _afterAttach(target) {
    this._target = target;
    logger.log(`Attached to ${this._getTargetStr()}`);
    chrome.debugger.onEvent.addListener(this._onEvent);
    chrome.debugger.onDetach.addListener(this._onDetach);
  }

  _afterDetach(reason) {
    logger.log(`Detached from ${this._getTargetStr()} with reason '${reason}'`);
    this._target = null;
    chrome.debugger.onEvent.removeListener(this._onEvent);
    chrome.debugger.onDetach.removeListener(this._onDetach);
  }

  _onDetach(target, reason) {
    if (this.isAttachedTo(target)) {
      this._afterDetach(reason);
    }
  }

  _onEvent(target, method, params) {
    if (this.isAttachedTo(target)) {
      this.onEvent.dispatch(method, params);
    }
  }
};

function prettyError(e, command, params) {
  // convert debugger error into pretty one
  // debugger error is object with single key 'message'
  const isDebuggerError = typeof e === 'object' && Object.keys(e).length === 1 && e.message;
  if (isDebuggerError) {
    let prettyMessage = e.message;
    try {
      const parsed = JSON.parse(e.message);
      const data = parsed.data === undefined ? '' : ` ${parsed.data}`;
      prettyMessage = `${parsed.message}${data}`;
    } catch (e) {
      // if can not parse, just return error message as is
    }
    const commandInfo = command ? ` Command: ${command} ${stringifyParams(params)}` : '';
    const error = new Error(`Debugger error '${prettyMessage}'${commandInfo}`);
    return Promise.reject(error);
  } else {
    return Promise.reject(e);
  }
}

function stringifyParams(params = []) {
  try {
    return JSON.stringify(params);
  } catch (e) {
    return `${params}`;
  }
}
