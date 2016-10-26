/**
 * Helper functions
 */

const WebElement = require('selenium-webdriver/lib/webdriver').WebElement;
const errors = require('../../errors');
const Targets = require('../../targets');

/**
 * Evaluate expression in current target
 *
 * @param {String} expression
 * @param {Boolean} [isAsync=false]
 * @returns {Promise}
 */
exports.evaluate = function (expression, isAsync = false) {
  return Promise.resolve()
    .then(() => Targets.ensureComplete())
    .then(() => {
      return Targets.debugger.sendCommand('Runtime.evaluate', {
        expression: expression,
        returnByValue: false,
        awaitPromise: isAsync,
      });
    })
    .then(res => {
      checkThrownError(res);
      return res.result;
    });
};

/**
 * This method is preferred over 'evaluate' as it allows to pass arguments as RemoteObjectId
 * that will be converted to js objects when function called.
 * But this method requires objectId even if we want to call function on 'window',
 * so we need to get 'window' as RemoteObjectId every time.
 *
 * @param {String} fnBody
 * @param {Array} args
 * @param {Boolean} [isAsync=false]
 * @returns {*}
 */
exports.callFunctionOn = function (fnBody, args, isAsync = false) {
  return Promise.resolve()
    .then(() => Targets.ensureComplete())
    .then(() => exports.evaluate('window'))
    .then(result => {
      return Targets.debugger.sendCommand('Runtime.callFunctionOn', {
        objectId: result.objectId,
        functionDeclaration: fnBody,
        arguments: args,
        returnByValue: false,
        awaitPromise: isAsync,
      })
    })
    .then(res => {
      checkThrownError(res);
      return res.result;
    });
};

exports.getOwnProperties = function (objectId) {
  return Targets.debugger.sendCommand('Runtime.getProperties', {
    objectId: objectId,
    ownProperties: true,
  })
    .then(res => res.result);
};

exports.getInternalProperties = function (objectId) {
  return Targets.debugger.sendCommand('Runtime.getProperties', {
    objectId: objectId,
    ownProperties: true,
  })
    .then(res => res.internalProperties)
};

exports.getWebElement = function (objectId) {
  // todo: yet not clear why we need getDocument before each request node
  return Targets.debugger.sendCommand('DOM.getDocument', {})
    .then(() => Targets.debugger.sendCommand('DOM.requestNode', {
      objectId: objectId,
    }))
    .then(res => WebElement.buildId(String(res.nodeId)));
};

/**
 * Resolves nodeId of WebElement to ObjectId
 * @param {String} id
 */
exports.resolveNode = function (id) {
  return Targets.debugger.sendCommand('DOM.resolveNode', {
      nodeId: Number(id)
    })
    .then(res => res.object.objectId);
};

// todo: move to common utils
exports.wait = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Creates error meaning error in executed javascript
 * @param {String} message
 */
exports.createError = function (message) {
  return new errors.JavascriptError(message);
};

function checkThrownError(res) {
  if (res && res.exceptionDetails) {
    throw exports.createError(res.result.description || res.exceptionDetails.text);
  }
}
