/**
 * Helper functions
 */

const WebElement = require('selenium-webdriver/lib/webdriver').WebElement;
const TargetManager = require('../../target-manager');

exports.evaluate = function (expression) {
  return TargetManager.debugger.sendCommand('Runtime.evaluate', {
    expression: expression,
    returnByValue: false,
  })
  .then(res => {
    exports.assertThrownError(res);
    return res.result;
  });
};

exports.callFunctionOn = function (fn, args) {
  return exports.evaluate('window')
    .then(result => {
      return TargetManager.debugger.sendCommand('Runtime.callFunctionOn', {
        objectId: result.objectId,
        functionDeclaration: fn,
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
  return TargetManager.debugger.sendCommand('Runtime.getProperties', {
      objectId: objectId,
      ownProperties: true,
    })
    .then(res => res.result);
};

exports.getOwnEnumProperties = function (objectId) {
  return exports.getOwnProperties(objectId)
    .then(props => props.filter(prop => prop.enumerable));
};

exports.getWebElement = function (objectId) {
  // todo: yet not clear why we need getDocument before each request node
  return TargetManager.debugger.sendCommand('DOM.getDocument', {})
    .then(() => TargetManager.debugger.sendCommand('DOM.requestNode', {
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

// todo: move to common utils
exports.wait = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};
