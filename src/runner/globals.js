/**
 * Globals available in tests
 */

const webdriver = require('./selenium-webdriver');
const seleniumTesting = require('./selenium-testing');
const Driver = require('../driver');
const fakeRequire = require('./fake-require');

exports.get = function (uiWindow) {
  return {
    chrome: chrome,
    Driver: Driver,
    By: webdriver.By,
    Key: webdriver.Key,
    until: webdriver.until,
    // for running tests
    test: seleniumTesting,
    /**
     * Assertions can not be registered here as they use instanceof comparisons that does not work between frames
     */
    //assert: seleniumAssert,
    runContext: {},
    // for running selenium tests as is
    require: fakeRequire,
    // for debug
    console: uiWindow.htmlConsole || window.console,
    // for custom reporting
    report: uiWindow.report,
    __filename: uiWindow.__filename || '',
  }
};
