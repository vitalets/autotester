/**
 * This fake require allows to run selenium tests in autotester without any edits.
 */

const map = {
  'selenium-webdriver': require('./selenium-webdriver'),
  'selenium-webdriver/testing/assert': require('selenium-webdriver/testing/assert'),
  'selenium-webdriver/testing': require('./selenium-testing'),
  'selenium-webdriver/lib/promise': require('selenium-webdriver/lib/promise'),
  'assert': require('assert'),
};

const aliases = new Map();

function fakeRequire(moduleName) {
  moduleName = applyAliases(moduleName);
  if (map.hasOwnProperty(moduleName)) {
    return map[moduleName];
  } else {
    console.log(map)
    throw new Error(`Unsupported module in fakeRequire: ${moduleName}`);
  }
}

fakeRequire.register = function (path, module) {
  map[path] = module;
};

fakeRequire.alias = function (alias, path) {
  aliases.set(alias, path);
};

function applyAliases(moduleName) {
  aliases.forEach((path, alias) => {
    moduleName = moduleName.replace(alias, path);
  });
  return moduleName;
}

module.exports = fakeRequire;
