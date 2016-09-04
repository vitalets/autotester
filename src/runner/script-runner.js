/**
 * Loads script from url and run
 * As script can contain driver commands, we check flow state after load.
 */

const promise = require('selenium-webdriver/lib/promise');
const utils = require('../utils');
const ListenerSwitch = require('../utils/listener-switch');
const logger = require('../utils/logger').create('Script-runner');

const {IDLE, UNCAUGHT_EXCEPTION} = promise.ControlFlow.EventType;

class ScriptRunner {
  /**
   * Constructor
   *
   * @param {String} url
   * @param {Object} context
   */
  constructor(url, context) {
    this._context = context;
    this._url = url;
    // todo: use custom control flow?
    this._flow = promise.controlFlow();
    this._setListeners();
  }

  run() {
    logger.log(`Loading: ${this._url}`);
    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
      this._contextListeners.on();
      return Promise.resolve()
        .then(() => this._loadScript())
        .then(() => this._waitFlow())
    })
    .then(() => logger.log(`Done: ${this._url}`))
    .catch(e => this._catch(e));
  }

  _initPromise() {
    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
      this._contextListeners.on();
    });
  }

  _loadScript() {
    return utils.loadScript(this._url, this._context.document);
  }

  _waitFlow() {
    if (this._flow.isIdle()) {
      this._resolve();
    } else {
      this._flowListeners.on();
    }
  }

  _onFlowIdle() {
    this._flowListeners.off();
    this._resolve();
  }

  _onFlowException(e) {
    this._flowListeners.off();
    this._flow.reset();
    this._reject(e);
  }

  _onContextError(errorEvent) {
    this._reject(errorEvent.error || errorEvent.reason);
  }

  _catch(error) {
    this._contextListeners.off();
    this._flowListeners.off();
    this._flow.reset();
    throw error;
  }

  _setListeners() {
    this._flowListeners = new ListenerSwitch([
      [this._flow, IDLE, this._onFlowIdle],
      [this._flow, UNCAUGHT_EXCEPTION, this._onFlowException],
    ], this);
    this._contextListeners = new ListenerSwitch([
      [this._context.onError, this._onContextError]
    ], this);
  }
}

module.exports = ScriptRunner;
