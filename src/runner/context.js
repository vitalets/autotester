/**
 * Specifies context: variables that are available in tests as globals
 */

const webdriver = require('./selenium-webdriver');
const seleniumAssert = require('selenium-webdriver/testing/assert');
const seleniumTesting = require('./selenium-testing');
const Driver = require('../driver');
const fakeRequire = require('./fake-require');

/**
 * Returns globals available in tests
 *
 * @param {Object} outer
 * @param {Object} outer.console
 * @param {String} outer.__filename
 */
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
