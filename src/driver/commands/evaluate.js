/**
 * Commands for executing script
 */

const TargetManager = require('../target-manager');

/**
 * Executes synchronous script
 *
 * @param {Object} params
 * @param {String} params.script
 * @param {Array} params.args
 */
exports.executeScript = function (params) {
  const argsAsString = JSON.stringify(params.args);
  const expression = `(function() {\n${params.script}\n}).apply(null, ${argsAsString})`;
  return Promise.resolve()
    .then(() => TargetManager.debugger.sendCommand('Runtime.evaluate', {
      expression: expression,
    }));
};

exports.executeAsyncScript = function (params) {

};
