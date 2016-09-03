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
   * @param {Object} document
   * @param {String} url
   */
  constructor(url, document) {
    this._document = document;
    this._url = url;
    // todo: use custom control flow?
    this._flow = promise.controlFlow();
    this._flowListeners = new ListenerSwitch([
      [this._flow, IDLE, this._onFlowIdle],
      [this._flow, UNCAUGHT_EXCEPTION, this._onFlowException],
    ], this);
  }

  run() {
    logger.log(`Loading: ${this._url}`);
    return Promise.resolve()
      .then(() => utils.loadScript(this._url, this._document))
      .then(() => this._waitFlow())
      .then(() => logger.log(`Done: ${this._url}`));
  }

  _waitFlow() {
    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
      if (this._flow.isIdle()) {
        this._fulfill();
      } else {
        this._flowListeners.on();
      }
    });
  }

  _onFlowIdle() {
    this._flowListeners.off();
    this._fulfill();
  }

  _onFlowException(e) {
    this._flowListeners.off();
    this._fulfill(e);
  }

  _fulfill(error) {
    if (error) {
      this._flow.reset();
      this._reject(error);
    } else {
      this._resolve();
    }
  }
}

module.exports = ScriptRunner;
