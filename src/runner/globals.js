/**
 * Specifies variables that are available in tests as globals
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
 * @param {Object} outer.runContext
 * @param {Object} outer.console
 * @param {String} outer.__filename
 */
exports.get = function (outer) {
  return {
    runContext: outer.runContext,
    console: outer.console,
    __filename: outer.__filename,
    Driver: Driver,
    By: webdriver.By,
    Key: webdriver.Key,
    until: webdriver.until,
    // for running tests
    test: seleniumTesting,
    assert: seleniumAssert,
    // for running selenium tests as is
    require: fakeRequire,
  };
};
