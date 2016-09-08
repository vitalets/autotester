/**
 * Loads script from url and run
 * As script can contain driver commands, we check flow state after load.
 */

const promise = require('selenium-webdriver/lib/promise');
const utils = require('../utils');
const Subscription = require('../utils/subscription');
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
      this._fulfilled = false;
      this._globalErrorListeners.on();
      return Promise.resolve()
        .then(() => this._loadScript())
        .then(() => this._waitFlow())
    })
    .then(() => logger.log(`Done: ${this._url}`))
    .catch(e => this._catch(e));
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

  /**
   * Notice that this event will not come from mocha as it wraps all errors
   */
  _onFlowException(e) {
    this._fulfill(e);
  }

  _onTestFileError(e) {
    this._fulfill(e);
  }

  _fulfill(error) {
    this._fulfilled = true;
    this._offListeners();
    if (error) {
      // this._flow.reset();
      this._reject(error);
    } else {
      this._resolve();
    }
  }

  /**
   * We can appear here after calling this._reject() or some other error
   * In second case we should cleanup listeners
   *
   * @param {Error} error
   */
  _catch(error) {
    if (!this._fulfilled) {
      this._fulfilled = true;
      this._offListeners();
    }
    return Promise.reject(error);
  }

  _setListeners() {
    this._flowListeners = new Subscription([
      {
        channel: this._flow,
        event: IDLE,
        listener: this._onFlowIdle.bind(this),
      },
      {
        channel: this._flow,
        event: UNCAUGHT_EXCEPTION,
        listener: this._onFlowException.bind(this),
      }
    ]);
    this._globalErrorListeners = new Subscription([
      {
        channel: this._context.__onTestFileError,
        listener: this._onTestFileError.bind(this),
      }
    ]);
  }

  _offListeners() {
    this._globalErrorListeners.off();
    this._flowListeners.off();
  }
}

module.exports = ScriptRunner;
