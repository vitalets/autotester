/**
 * Globals available in tests
 */

const webdriver = require('./selenium-webdriver');
const seleniumAssert = require('selenium-webdriver/testing/assert');
const seleniumTesting = require('./selenium-testing');
const Driver = require('../driver');
const fakeRequire = require('./fake-require');

exports.get = function (uiWindow) {
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
    console: uiWindow.htmlConsole || window.console,
    // for custom reporting
    report: uiWindow.report,
    __filename: uiWindow.__filename || '',
    // for custom user data between files
    runContext: {},
  }
};
