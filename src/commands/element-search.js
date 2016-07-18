/**
 * Commands to search element on page
 */

const seleniumCommand = require('selenium-webdriver/lib/command');
const webdriver = require('selenium-webdriver/lib/webdriver');
const TargetManager = require('../target-manager');

exports.commands = {
  // [seleniumCommand.Name.GET_ACTIVE_ELEMENT]: ElementSearch.start,
  [seleniumCommand.Name.FIND_ELEMENT]: findElement,
  [seleniumCommand.Name.FIND_ELEMENTS]: findElements,
  [seleniumCommand.Name.FIND_CHILD_ELEMENT]: findChildElement,
  [seleniumCommand.Name.FIND_CHILD_ELEMENTS]: findChildElements,
};

function findElement(params) {
  return getRootNodeId()
    .then(rootNodeId => new Finder(params.using, params.value, rootNodeId).find());
}

function findElements(params) {
  return getRootNodeId()
    .then(rootNodeId => new Finder(params.using, params.value, rootNodeId, true).find());
}

function findChildElement(params) {
  return new Finder(params.using, params.value, params.id).find();
}

function findChildElements(params) {
  return new Finder(params.using, params.value, params.id, true).find();
}

// === internal ===

function getRootNodeId() {
  if (typeof TargetManager.rootId === 'number') {
    return Promise.resolve(TargetManager.rootId);
  } else {
    return TargetManager.debugger.sendCommand('DOM.getDocument', {})
      .then(res => TargetManager.rootId = res.root.nodeId);
  }
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
    return TargetManager.debugger.sendCommand(queryCommand, {
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
    return webdriver.WebElement.buildId(String(nodeId));
  }
}
