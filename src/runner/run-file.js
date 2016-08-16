/**
 * Runs particular file code
 */

const promise = require('selenium-webdriver/lib/promise');
const evaluate = require('../utils/evaluate');
const {IDLE, UNCAUGHT_EXCEPTION} = promise.ControlFlow.EventType;
const logger = require('../utils/logger').create('Run-file');

class RunFile {
  /**
   * Constructor
   *
   * @param {String} code
   * @param {String} filename
   * @param {Object} args
   */
  constructor(code, filename, args) {
    this._code = code;
    this._filename = filename;
    this._args = args;
    this._flow = promise.controlFlow();
  }

  run() {
    logger.log(`Running: ${this._filename}`);
    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
      this._fulfilled = false;
      this._evaluate();
      this._checkIdle();
      this._listenIdle();
      this._listenException();
    });
  }

  _evaluate() {
    try {
      evaluate.asFunction(this._code, this._args);
    } catch(e) {
      this._fulfill(e);
    }
  }

  _checkIdle() {
    if (!this._fulfilled && this._flow.isIdle()) {
      this._fulfill();
    }
  }

  _listenIdle() {
    if (!this._fulfilled) {
      this._flow.on(IDLE, () => {
        this._flow.removeAllListeners();
        this._fulfill();
      });
    }
  }

  _listenException() {
    if (!this._fulfilled) {
      this._flow.on(UNCAUGHT_EXCEPTION, e => this._fulfill(e));
    }
  }

  _fulfill(error) {
    this._fulfilled = true;
    if (error) {
      // try catch here is needed as we are already in catch and can not throw second error
      // so at least log it to console
      try {
        this._attachErrorUiMessage(error);
        this._flow.reset();
      } catch (e) {
        console.error(e);
      }
      this._reject(error);
    } else {
      this._resolve();
    }
  }

  _attachErrorUiMessage(error) {
    error.uiMessage = evaluate.getErrorMessage(error, this._filename);
  }
}

module.exports = RunFile;
