/**
 * Commands for executing script
 */

const helper = require('./helper');
const RemoteObject = require('./remote-object');
const remotePromise = require('./remote-promise');
const prepareArgs = require('./prepare-args');
const prepareScript = require('./prepare-script');

/**
 * Executes sync script
 *
 * @param {Object} params
 * @param {String} params.script
 * @param {Array} params.args
 */
exports.executeScript = function (params) {
  return execute(params.script, params.args)
    .then(success);
};

/**
 * Executes async script
 *
 * @param {Object} params
 * @param {String} params.script
 * @param {Array} params.args
 */
exports.executeAsyncScript = function (params) {
  return execute(params.script, params.args, true)
    .then(result => {
      return remotePromise.wait(result.objectId)
        .then(success, error);
    })
};

/**
 * Helper object
 */
exports.helper = helper;

/**
 * Common execute part for sync and async evaluates
 * When where are no arguments it's cheaper to call `evaluate` instead of `callFunctionOn`
 *
 * @param {String} script
 * @param {Array} args
 * @param {Boolean} isAsync
 * @returns {Promise}
 */
function execute(script, args, isAsync) {
  return Promise.resolve()
    .then(() => prepareArgs(args))
    .then(args => {
      let wrappedScript = isAsync ? prepareScript.asPromise(script) : script;
      if (args.length) {
        const fnBody = prepareScript.asFunction(wrappedScript);
        return helper.callFunctionOn(fnBody, args)
      } else {
        const expression = prepareScript.asSelfCallFunction(wrappedScript);
        return helper.evaluate(expression);
      }
    })
}

function success(result) {
  return new RemoteObject(result).value();
}

function error(err) {
  return err.objectId ? new RemoteObject(err).value() : err;
}
