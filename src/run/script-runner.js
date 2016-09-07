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
    this._url = url;
    this._context = context;
    // todo: use custom control flow?
    this._flow = promise.controlFlow();
    this._setListeners();
  }

  run() {
    logger.log(`Loading: ${this._url}`);
    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
      this._globalErrorListeners.on();
      return Promise.resolve()
        .then(() => this._loadScript())
        .then(() => this._waitFlow())
    })
    .then(() => logger.log(`Done: ${this._url}`))
    //.catch(e => this._catch(e));
  }

  _loadScript() {
    return utils.loadScript(this._url, this._context.document);
  }

  _waitFlow() {
    if (this._flow.isIdle()) {
      this._fulfill();
    } else {
      this._flowListeners.on();
    }
  }

  _onFlowIdle() {
    this._fulfill();
  }

  _onFlowException(e) {
    this._fulfill(e);
  }

  _onTestFileError(error) {
    // mark error with special flag to inform user that error is inside test itself
    error.isTestFile = true;
    this._fulfill(error);
  }

  _fulfill(error) {
    this._globalErrorListeners.off();
    this._flowListeners.off();
    if (error) {
      this._flow.reset();
      this._reject(error);
    } else {
      this._resolve();
    }
  }

  _catch(error) {
    console.warn('catched')
    this._globalErrorListeners.off();
    // todo: do we really need this?
    // this._flowListeners.off();
    // this._flow.reset();
    throw error;
  }

  _setListeners() {
    this._flowListeners = new ListenerSwitch([
      [this._flow, IDLE, this._onFlowIdle],
      [this._flow, UNCAUGHT_EXCEPTION, this._onFlowException],
    ], this);
    this._globalErrorListeners = new ListenerSwitch([
      [this._context.__onTestFileError, this._onTestFileError],
    ], this);
  }
}

module.exports = ScriptRunner;
