/**
 * Commands for executing script
 */

const helper = require('./helper');
const RemoteObject = require('./remote-object');
const awaitPromise = require('./await-promise');
const prepareArgs = require('./prepare-args');

/**
 * Executes sync script
 *
 * @param {Object} params
 * @param {String} params.script
 * @param {Array} params.args
 */
exports.executeScript = function (params) {
  return Promise.resolve()
    .then(() => prepareArgs(params.args))
    .then(args => {
      const fn = wrapFunction(params.script);
      return helper.callFunctionOn(fn, args)
    })
    .then(result => new RemoteObject(result).value())
};

/**
 * Executes async script
 *
 * @param {Object} params
 * @param {String} params.script
 * @param {Array} params.args
 */
exports.executeAsyncScript = function (params) {
  return Promise.resolve()
    .then(() => prepareArgs(params.args))
    .then(args => {
      const fn = wrapPromiseFunction(params.script);
      return helper.callFunctionOn(fn, args)
    })
    .then(result => {
      return awaitPromise(result.objectId)
        .then(
          result => new RemoteObject(result).value(),
          err => err.objectId ? new RemoteObject(err).value() : err
        )
    })
};

/**
 * Helper object
 */
exports.helper = helper;

function wrapFunction(code) {
  // for some reason callFunctionOn converts {value: null} to undefined
  // todo: create issue
  // todo: remember arguments that are really null and transform only them,
  // todo: as in current case real undefined will be also converted to null
  return `function() {
    for (let i=0; i<arguments.length; i++) {
      if (arguments[i] === undefined) {
        arguments[i] = null;
      }
    }
    ${code}
  }`;
}

function wrapPromiseFunction(code) {
  const promisedCode = `
    return new Promise(resolve => {
      [].push.call(arguments, resolve);
      ${code}
    });`;
  return wrapFunction(promisedCode);
}
