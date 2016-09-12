/**
 * This fake require allows to process require calls when running node compatible tests in browser.
 */

const modules = new Map();
const aliases = new Map();

/**
 * Performs needed cleanup and returns fake-require function
 *
 * @returns {Function}
 */
exports.getFn = function () {
  modules.clear();
  aliases.clear();
  return fakeRequire;
};

function fakeRequire(moduleName) {
  moduleName = applyAliases(moduleName);
  if (modules.has(moduleName)) {
    return modules.get(moduleName);
  } else {
    console.warn(moduleName, modules);
    throw new Error(`Unsupported module in fakeRequire: ${moduleName}`);
  }
}

fakeRequire.register = function (path, module) {
  modules.set(path, module);
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
