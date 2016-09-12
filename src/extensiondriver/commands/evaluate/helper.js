/**
 * Helper functions
 */

const WebElement = require('selenium-webdriver/lib/webdriver').WebElement;
const Targets = require('../../targets');

/**
 * Evaluate expression in current target
 *
 * @param {String} expression
 * @returns {Promise}
 */
exports.evaluate = function (expression) {
  return Promise.resolve()
    .then(() => Targets.ensureComplete())
    .then(() => {
      return Targets.debugger.sendCommand('Runtime.evaluate', {
        expression: expression,
        returnByValue: false,
      });
    })
    .then(res => {
      exports.assertThrownError(res);
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
 * @returns {*}
 */
exports.callFunctionOn = function (fnBody, args) {
  return Promise.resolve()
    .then(() => Targets.ensureComplete())
    .then(() => exports.evaluate('window'))
    .then(result => {
      return Targets.debugger.sendCommand('Runtime.callFunctionOn', {
        objectId: result.objectId,
        functionDeclaration: fnBody,
        arguments: args,
        returnByValue: false,
      })
    })
    .then(res => {
      exports.assertThrownError(res);
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

exports.assertThrownError = function (res) {
  if (res.wasThrown) {
    throw new Error('Error in evaluated script: ' + res.result.description);
    //throw new Error('Error in evaluated script: ' + res.exceptionDetails.text);
  }
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
