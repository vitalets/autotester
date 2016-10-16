/**
 * Allows to register custom commands
 */

const Executor = require('selenium-webdriver/lib/http').Executor;

// map of commands
const commands = new Map();
// map of executors where we already added custom commands
const executors = new WeakMap();

/**
 * Setup custom commands hook via http executor class
 */
exports.setup = function () {
  const currentFn = Executor.prototype.execute;
  if (currentFn.name !== 'customExecute') {
    Executor.prototype.execute = function customExecute() {
      if (!executors.has(this)) {
        executors.set(this, true);
        commands.forEach(cmd => this.defineCommand(cmd.name, cmd.method, cmd.path));
      }
      return currentFn.apply(this, arguments);
    };
  }
};

/**
 * Register custom command
 *
 * @param {String} name
 * @param {String} method
 * @param {String} path
 */
exports.register = function (name, method, path) {
  commands.set(name, {name, method, path});
};
