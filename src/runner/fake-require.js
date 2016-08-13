/**
 * This fake require allows to run selenium tests in autotester without any edits.
 */

const webdriver = require('./selenium-webdriver');

module.exports = function(moduleName) {
  switch (moduleName) {
    case 'selenium-webdriver':
      return webdriver;
    case 'selenium-webdriver/testing/assert':
      return window.assert;
    case 'selenium-webdriver/testing':
      return window.test;
    case 'selenium-webdriver/lib/test':
      return window.test;
    case 'selenium-webdriver/lib/promise':
      return webdriver.promise;
    case 'assert':
      return require('assert');
    default:
      throw new Error(`Unsupported module in fakeRequire: ${moduleName}`);
  }
};
