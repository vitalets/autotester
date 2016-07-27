/**
 * Manager for command target: current tab/window
 * Target has several properties:
 * - handle
 * - tabId
 * - attached debugger
 * - root nodeId
 * - execution context id
 * - ...
 *
 */

const thenChrome = require('then-chrome');
const Debugger = require('./debugger');
const logger = require('./logger').create('TargetManager');

const currentTarget = {
  handle: null,
  tabId: null,
  debugger: null,
  rootId: null,
  contextId: null,
};
const usedTabIds = new Set();
const debuggers = [];

module.exports = {
  reset() {
    this._clearCurrentTarget();
    usedTabIds.clear();
    debuggers.length = 0;
  },

  get handle() {
    return currentTarget.handle;
  },

  get tabId() {
    return currentTarget.tabId;
  },

  get debugger() {
    return currentTarget.debugger;
  },

  get rootId() {
    return currentTarget.rootId;
  },

  set rootId(value) {
    currentTarget.rootId = value;
  },

  switchTo(target) {
    this._clearCurrentTarget();
    currentTarget.handle = target.handle;
    return target.extensionId
      ? this._switchToExtension(target)
      : this._switchToTab(target);
  },

  quit() {
    return Promise.resolve()
      .then(detachDebuggers)
      .then(closeUsedTabs);
  },

  _switchToTab(target) {
    logger.log('Switching to tab', target.url);
    currentTarget.tabId = target.tabId;
    usedTabIds.add(target.tabId);
    return Promise.resolve()
      .then(() => thenChrome.tabs.update(target.tabId, {active: true}))
      .then(() => attachDebugger({tabId: target.tabId}));
  },

  _switchToExtension(target) {
    logger.log('Switching to extension', target.extensionId);
    return Promise.resolve()
      .then(() => attachDebugger({extensionId: target.extensionId}));
  },

  _switchToFrame(frameId) {
    // todo
  },

  _clearCurrentTarget() {
    Object.keys(currentTarget).forEach(key => currentTarget[key] = null);
  }
};

function attachDebugger(target) {
  const existingDebugger = debuggers.filter(d => d.isAttachedTo(target))[0];
  if (existingDebugger) {
    currentTarget.debugger = existingDebugger;
    return Promise.resolve();
  } else {
    currentTarget.debugger = new Debugger();
    debuggers.push(currentTarget.debugger);
    return currentTarget.debugger.attach(target);
  }
}

function detachDebuggers() {
  const tasks = debuggers.map(d => d.detach());
  return Promise.all(tasks)
    .then(() => debuggers.length = 0);
}

function closeUsedTabs() {
  return thenChrome.tabs.remove([...usedTabIds])
    .then(() => usedTabIds.clear());
}
