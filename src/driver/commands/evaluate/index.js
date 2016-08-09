/**
 * Commands for executing script
 */

const helper = require('./helper');
const RemoteObject = require('./remote-object');
const awaitPromise = require('./await-promise');
const argsProcessor = require('./args');

/**
 * Executes sync script
 *
 * @param {Object} params
 * @param {String} params.script
 * @param {Array} params.args
 */
exports.executeScript = function (params) {
  return Promise.resolve()
    .then(() => argsProcessor.process(params.args))
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
    .then(() => argsProcessor.process(params.args))
    .then(args => {
      const fn = wrapPromiseFunction(params.script);
      return helper.callFunctionOn(fn, args)
    })
    .then(result => awaitPromise(result.objectId))
    .then(result => new RemoteObject(result).value())
};

function wrapFunction(code) {
  // for some reason callFunctionOn does converts {value: null} to undefined
  // todo: create issue
  // todo: remember arguments that are really null and transform only them
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
