/**
 * Helper functions
 */

const WebElement = require('selenium-webdriver/lib/webdriver').WebElement;
const Targets = require('../../targets');

exports.evaluate = function (expression) {
  return Targets.debugger.sendCommand('Runtime.evaluate', {
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
      return Targets.debugger.sendCommand('Runtime.callFunctionOn', {
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

// todo: move to common utils
exports.wait = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};
