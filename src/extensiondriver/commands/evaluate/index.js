/**
 * Commands for executing script
 */

const helper = require('./helper');
const RemoteObject = require('./remote-object');
const prepareArgs = require('./prepare-args');
const prepareScript = require('./prepare-script');

/**
 * Executes sync script
 *
 * @param {Object} params
 * @param {String} params.script
 * @param {Array} params.args
 */
exports.execute = function (params) {
  return execute(params.script, params.args)
    .then(
      handleSuccess,
      handleError
    );
};

/**
 * Executes async script
 *
 * @param {Object} params
 * @param {String} params.script
 * @param {Array} params.args
 */
exports.executeAsync = function (params) {
  return execute(params.script, params.args, true)
    .then(
      handleSuccess,
      handleError
    );
    // .then(result => {
    //   return remotePromise.wait(result.objectId)
    //     .then(
    //       handleSuccess,
    //       handleError
    //     );
    // })
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
        return helper.callFunctionOn(fnBody, args, isAsync)
      } else {
        const expression = prepareScript.asSelfCallFunction(wrappedScript);
        return helper.evaluate(expression, isAsync);
      }
    })
}

function handleSuccess(result) {
  return new RemoteObject(result).value();
}

function handleError(err) {
  // if error came as remoteObject --> resolve it first
  if (err.objectId) {
    return Promise.resolve()
      .then(() => new RemoteObject(err).value())
      .then(value => Promise.reject(value))
  } else {
    return Promise.reject(err);
  }
}
