/**
 * Globals available in tests
 */

const Channel = require('chnl');
const seleniumAssert = require('selenium-webdriver/testing/assert');
const webdriver = require('./selenium-webdriver');
const seleniumTesting = require('./selenium-testing');
const Driver = require('../driver');
const fakeRequire = require('./fake-require');

exports.export = function (target, uiWindow) {
  Object.assign(target, {
    // webdriver
    Driver: Driver,
    By: webdriver.By,
    Key: webdriver.Key,
    until: webdriver.until,
    // for running tests
    test: seleniumTesting,
    assert: seleniumAssert,
    // for custom user data
    runContext: {},
    // for running selenium tests as is
    require: fakeRequire,
    // for debug
    uiConsole: uiWindow.sharedConsole,
    // for custom reporting
    //report: uiWindow.report,
    // this channel is used in test-file wrapper for catching errors
    __onTestFileError: new Channel()
  });
};

/**
 * Clear some keys
 *
 * @param {Window} target
 */
exports.clear = function (target) {
  delete target.runContext;
  delete target.require;
  delete target.uiConsole;
  delete target.__onTestFileError;
};
