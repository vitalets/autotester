/**
 * Specifies variables that are available in tests as globals
 */

const webdriver = require('./selenium-webdriver');
const seleniumAssert = require('selenium-webdriver/testing/assert');
const seleniumTesting = require('./selenium-testing');
const Driver = require('../driver');
const fakeRequire = require('./fake-require');

exports.get = function (win) {
  return {
    runContext: {},
    Driver: Driver,
    By: webdriver.By,
    Key: webdriver.Key,
    until: webdriver.until,
    // for running tests
    test: seleniumTesting,
    assert: seleniumAssert,
    // for running selenium tests as is
    require: fakeRequire,
    // for debugging
    console: win.console,
  };
};
