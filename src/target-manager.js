/**
 * Manager for command target: current tab/window
 * Target has several properties:
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
  tabId: null,
  debugger: null,
  rootId: null,
  contextId: null,
};
const usedTabIds = new Set();
const debuggers = [];

module.exports = {
  reset() {
    Object.assign(currentTarget, {
      tabId: null,
      debugger: null,
      rootId: null,
      contextId: null,
    });
    usedTabIds.clear();
    debuggers.length = 0;
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

  switchToTab(tabId) {
    logger.log('Switching to tab', tabId);
    currentTarget.tabId = tabId;
    currentTarget.rootId = null;
    usedTabIds.add(tabId);
    return Promise.resolve()
      .then(() => thenChrome.tabs.update(tabId, {active: true}))
      .then(() => attachDebugger({tabId}));
  },

  switchToFrame(frameId) {
  // todo
  },

  switchToExtension(extensionId) {
  // todo
  },

  quit() {
    return Promise.resolve()
      .then(detachDebuggers)
      .then(closeUsedTabs);
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
