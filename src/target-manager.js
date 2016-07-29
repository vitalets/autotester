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
const targetFilter = require('./target-filter');
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
    clearCurrentTarget();
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

  getAllTargets() {
    // todo: add inactive background event pages
    return thenChrome.debugger.getTargets()
      .then(targets => {
        return targets
          .filter(targetFilter.isCorrectTarget)
          .map(addHandle);
      });
  },

  switchByProp(prop, value) {
    return this.getAllTargets()
      .then(targets => {
        const target = targets.filter(target => target[prop] === value)[0];
        if (target) {
          clearCurrentTarget();
          currentTarget.handle = target.handle;
          return target.extensionId
            ? switchToExtension(target)
            : switchToTab(target);
        } else {
          return Promise.reject(`Target with ${prop} = '${value}' does not exist`);
        }
      });
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

function addHandle(target) {
  if (target.type === 'page') {
    target.handle = target.id;
  }
  if (target.type === 'background_page') {
    target.handle = target.extensionId;
  }
  return target;
}

function switchToTab(target) {
  logger.log('Switching to tab', target.url);
  currentTarget.tabId = target.tabId;
  usedTabIds.add(target.tabId);
  return Promise.resolve()
    .then(() => thenChrome.tabs.update(target.tabId, {active: true}))
    .then(() => attachDebugger({tabId: target.tabId}));
}

function switchToExtension(target) {
  logger.log('Switching to extension', target.extensionId);
  return Promise.resolve()
    .then(() => attachDebugger({extensionId: target.extensionId}));
}

function switchToFrame(frameId) {
  // todo
}

function clearCurrentTarget() {
  Object.keys(currentTarget).forEach(key => currentTarget[key] = null);
}
