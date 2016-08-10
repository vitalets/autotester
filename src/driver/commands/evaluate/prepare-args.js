/**
 * Prepare arguments before evaluation
 */

const WebElement = require('selenium-webdriver/lib/webdriver').WebElement;
const cmdElement = require('../element');
const helper = require('./helper');

module.exports = function (args) {
  const tasks = args.map(arg => {
    if (WebElement.isId(arg)) {
      return processWebElement(arg);
    } else if (typeof arg === 'object' && arg !== null) {
      return processObject(arg);
    } else {
      return processPrimitive(arg);
    }
  });
  return Promise.all(tasks);
};

function processWebElement(arg) {
  const nodeId = WebElement.extractId(arg);
  return cmdElement.resolveNode(nodeId)
    .then(objectId => {
      return {objectId};
    });
}

function processObject(arg) {
  const strArg = JSON.stringify(arg);
  const expression = `(function() { return ${strArg} })()`;
  return helper.evaluate(expression)
    .then(result => {
      return {objectId: result.objectId};
    });
}

function processPrimitive(arg) {
  return {value: arg};
}
