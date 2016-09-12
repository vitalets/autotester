/**
 * Globals available in tests
 */

const Channel = require('chnl');
const webdriver = require('selenium-webdriver');

exports.export = function (target, uiWindow) {
  Object.assign(target, {
    // webdriver
    webdriver: webdriver,
    By: webdriver.By,
    Key: webdriver.Key,
    until: webdriver.until,
    // autotester specials
    // Driver: require('../driver'),
    // for running tests
    test: require('selenium-webdriver/testing'),
    assert: require('selenium-webdriver/testing/assert'),
    // for custom user data
    runContext: {},
    // for running tests writen for node
    require: require('./fake-require').getFn(),
    // for debug
    uiConsole: uiWindow.sharedConsole,
    // for custom reporting
    report: uiWindow.report,
    // this channel is used in test-file wrapper for catching errors
    __onTestFileError: new Channel()
  });
};

/**
 * Clear some keys on each session
 *
 * @param {Window} target
 */
exports.clear = function (target) {
  delete target.runContext;
  delete target.require;
  delete target.uiConsole;
  delete target.__onTestFileError;

  // remove selenium-webdriver/testing from cache as it wraps mocha globals on start
  delete require.cache[require.resolve('selenium-webdriver/testing')];
};
