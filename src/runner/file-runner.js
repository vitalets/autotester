/**
 * Runs particular file code
 */

const promise = require('selenium-webdriver/lib/promise');
const evaluate = require('../utils/evaluate');
const logger = require('../utils/logger').create('File-runner');

const {IDLE, UNCAUGHT_EXCEPTION} = promise.ControlFlow.EventType;

class FileRunner {
  /**
   * Constructor
   *
   * @param {String} code
   * @param {String} filename
   * @param {Object} args
   * @param {ControlFlow} flow
   */
  constructor(code, filename, args, flow) {
    this._code = code;
    this._filename = filename;
    this._args = args;
    this._flow = flow;
    this._onFlowIdle = this._onFlowIdle.bind(this);
    this._onFlowException = this._onFlowException.bind(this);
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

  _manageFlowListeners(action) {
    if (action === 'set') {
      if (!this._fulfilled) {
        this._flow.on(IDLE, this._onFlowIdle);
        this._flow.on(UNCAUGHT_EXCEPTION, this._onFlowException);
      }
    } else {
      this._flow.removeListener(IDLE, this._onFlowIdle);
      this._flow.removeListener(UNCAUGHT_EXCEPTION, this._onFlowException);
    }
  }

  _onFlowIdle() {
    this._manageFlowListeners('remove');
    this._fulfill();
  }

  _onFlowException(e) {
    this._manageFlowListeners('remove');
    this._fulfill(e);
  }

  _fulfill(error) {
    this._fulfilled = true;
    if (error) {
      // try catch here is needed as we are already in catch and can not throw second error
      // so at least log it to console
      try {
        evaluate.fixStack(error, this._filename);
        if (this._isTestSelfError(error)) {
          error.isTestSelf = true;
        }
        this._flow.reset();
      } catch (e) {
        console.error(e);
      }
      this._reject(error);
    } else {
      this._resolve();
    }
  }

  /**
   * Is error occurred in test code itself
   * (check first line of stack trace)
   *
   * @param {Error} error
   */
  _isTestSelfError(error) {
    const stack = error.stack;
    if (!stack) {
      return false;
    }
    const stackLines = stack.split('\n');
    return stackLines[1] && stackLines[1].indexOf(this._filename) >= 0;
  }
}

module.exports = FileRunner;
