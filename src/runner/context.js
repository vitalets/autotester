/**
 * Creates context for execution
 * basically it is dynamic iframe element that loads scripts via <script> tag
 * Advantages of such approach over eval:
 * - easy debug of tests (you can put breakpoint)
 * - normal filenames in error stack trace
 * - isolation of top window
 */

const webdriver = require('./selenium-webdriver');
const seleniumAssert = require('selenium-webdriver/testing/assert');
const seleniumTesting = require('./selenium-testing');
const Driver = require('../driver');
const utils = require('../utils');
const fakeRequire = require('./fake-require');

class Context {
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
      })
  }

  /**
   * Removes frame
   */
  clear() {
    return this._removeFrame();
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
    this.window.addEventListener('error', event => {
      // event.preventDefault();
      setTimeout(() => {
        window.dispatchEvent(event);
      }, 0);

      //utils.asyncThrow(event.error);
    });
    this.window.addEventListener('unhandledrejection', event => {
      //event.preventDefault();
      //window.dispatchEvent(event);
      //console.log(111, Object.prototype.toString.call(event) instanceof this.window.PromiseRejectionEvent)
      setTimeout(() => {
        window.dispatchEvent(event);
      }, 0);
     // const error =
      //utils.asyncThrow(event.reason);
    });
  }

  _removeFrame() {
    this._iframe.parentNode.removeChild(this._iframe);
    this._iframe = null;
  }
}

module.exports = Context;

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
