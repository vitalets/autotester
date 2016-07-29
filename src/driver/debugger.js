/**
 * Debugger attached to particular target
 */

const thenChrome = require('then-chrome');
const logger = require('./logger').create('Debugger');

class Debugger {

  attach(target) {
    this._target = target;
    this._targetStr = JSON.stringify(target);
    return thenChrome.debugger.attach(this._target, '1.1')
      .then(() => logger.log(`Attached to ${this._targetStr}`));
  }

  sendCommand(name, params = {}) {
    logger.log(`Send command ${name}`, params);
    return thenChrome.debugger.sendCommand(this._target, name, params)
      .then(res => {
        logger.log(`Response to '${name}'`, res);
        return res;
      })
      .catch(Debugger.convertError);
  }

  detach() {
    return thenChrome.debugger.detach(this._target)
      .then(() => logger.log(`Detached from ${this._targetStr}`));
  }

  getTarget() {
    return this._target;
  }

  isAttachedTo(target) {
    const sameTabId = this._target.tabId && this._target.tabId === target.tabId;
    const sameExtensionId = this._target.extensionId && this._target.extensionId === target.extensionId;
    return sameTabId || sameExtensionId;
  }

  static convertError(e) {
    // convert debugger error into readable one
    // debugger error is object with single key 'message'
    const isDebuggerError = typeof e === 'object' && Object.keys(e).length === 1 && e.message;
    if (isDebuggerError) {
      const info = JSON.parse(e.message);
      const readableMessage = `Debugger error '${info.message} ${info.data}'`;
      return Promise.reject(new Error(readableMessage));
    } else {
      return Promise.reject(e);
    }
  }
}

module.exports = Debugger;
