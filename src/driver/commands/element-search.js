/**
 * Commands to search element on page
 */

const WebElement = require('selenium-webdriver/lib/webdriver').WebElement;
const Targets = require('../targets');

exports.findElement = function (params) {
  return Promise.resolve()
    .then(() => getRootNodeId())
    .then(rootNodeId => new Finder(params.using, params.value, rootNodeId).find());
};

exports.findElements = function (params) {
  return Promise.resolve()
    .then(() => getRootNodeId())
    .then(rootNodeId => new Finder(params.using, params.value, rootNodeId, true).find());
};

exports.findChildElement = function (params) {
  return new Finder(params.using, params.value, params.id).find();
};

exports.findChildElements = function (params) {
  return new Finder(params.using, params.value, params.id, true).find();
};

function getRootNodeId() {
  // todo: save rootId in targets and update after navigations and switchto commands
  // todo: chromedriver seems to do it after DEVTOOLS EVENT DOM.documentUpdated
  /*
  if (typeof Targets.rootId === 'number') {
    return Promise.resolve(Targets.rootId);
  } else {
    return Targets.debugger.sendCommand('DOM.getDocument', {})
      .then(res => Targets.rootId = res.root.nodeId);
  }
  */
  return Targets.debugger.sendCommand('DOM.getDocument', {})
    .then(res => Targets.rootId = res.root.nodeId);
}

class Finder {
  constructor(strategy, value, startNodeId, all = false) {
    this._strategy = strategy;
    this._value = value;
    this._startNodeId = startNodeId;
    this._all = all;
  }

  find() {
    return this._query()
      .then(res => this._processResult(res));
  }

  _query() {
    switch (this._strategy) {
      case 'css selector':
        return this._queryByCss();
      default:
        throw new Error(`Unsupported strategy ${this._strategy}`);
    }
  }

  _queryByCss() {
    const queryCommand = this._all ? 'DOM.querySelectorAll' : 'DOM.querySelector';
    return Targets.debugger.sendCommand(queryCommand, {
      nodeId: Number(this._startNodeId),
      selector: this._value
    });
  }

  _processResult(res) {
    if (this._all) {
      return res.nodeIds.map(Finder.toSeleniumElement);
    } else {
      return res.nodeId
        ? Finder.toSeleniumElement(res.nodeId)
        : Promise.reject(`Element not found by ${this._value}`);
    }
  }

  static toSeleniumElement(nodeId) {
    return WebElement.buildId(String(nodeId));
  }
}
