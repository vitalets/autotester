/**
 * Creates sandbox for execution of tests
 * Basically it is dynamic iframe element that loads scripts via <script> tag
 * Advantages of such approach over eval:
 * - easy debug of tests (you can put breakpoint)
 * - normal filenames in error stack trace
 * - isolation of top window
 */

const Channel = require('chnl');
const logger = require('../utils/logger').create('Sandbox');

class Sandbox {
  constructor() {
    this.onError = new Channel();
  }
  /**
   * Creates frame and set globals
   *
   * @param {Object} [globals]
   */
  prepare(globals) {
    return this._createFrame()
      .then(() => {
        this._setGlobals(globals);
        this._proxyErrors();
        logger.log('New sandbox created');
      })
  }

  /**
   * Removes frame
   */
  clear() {
    this._removeFrame();
    logger.log('Sandbox cleared');
  }

  get window() {
    return this._iframe.contentWindow;
  }

  get document() {
    return this._iframe.contentDocument;
  }

  _createFrame() {
    return new Promise(resolve => {
      this._iframe = document.createElement('iframe');
      this._iframe.addEventListener('load', resolve);
      document.body.appendChild(this._iframe);
    });
  }

  _setGlobals(globals) {
    Object.assign(this.window, globals);
  }

  _proxyErrors() {
    this.window.addEventListener('error', event => this._proxyError(event));
    this.window.addEventListener('unhandledrejection', event => this._proxyError(event));
  }

  _proxyError(event) {
    event.preventDefault();
    this.onError.dispatch(event);
  }

  _removeFrame() {
    this._iframe.parentNode.removeChild(this._iframe);
    this._iframe = null;
  }
}

module.exports = Sandbox;

/**
 * Returns globals available in tests
 *
 * @param {Object} outer
 * @param {Object} outer.console
 * @param {String} outer.__filename
 */
/*
exports.create = function (outer) {
  return {
    Driver: Driver,
    By: webdriver.By,
    Key: webdriver.Key,
    until: webdriver.until,
    // for running tests
    test: seleniumTesting,
    assert: seleniumAssert,
    // for running selenium tests as is
    require: fakeRequire,
    // for debug
    console: outer.console || window.console,
    // for custom reporting
    report: outer.report,
    __filename: outer.__filename || '',
    // for custom user data between files
    runContext: {},
    // for mocha to be happy
    location: {},
    Date: window.Date,
    setTimeout: window.setTimeout,
    setInterval: window.setInterval,
    clearTimeout: window.clearTimeout,
    clearInterval: window.clearInterval,
    get onerror() { return window.onerror; },
    set onerror(val) { window.onerror = val; },
  };
};
*/
