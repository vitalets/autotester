/**
 * This fake require allows to run selenium tests in autotester without any edits.
 */

const MAP = {
  'selenium-webdriver': require('./selenium-webdriver'),
  'selenium-webdriver/testing/assert': require('selenium-webdriver/testing/assert'),
  'selenium-webdriver/testing': require('./selenium-testing'),
  'selenium-webdriver/lib/promise': require('selenium-webdriver/lib/promise'),
  'assert': require('assert'),
};

module.exports = function(moduleName) {
  if (MAP.hasOwnProperty(moduleName)) {
    return MAP[moduleName];
  } else {
    throw new Error(`Unsupported module in fakeRequire: ${moduleName}`);
  }
};
