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
const filter = require('./filter');
const tabLoader = require('../tab-loader');
const logger = require('../../utils/logger').create('Targets');

const TAB_PREFIX = 'tab-';
const EXTENSION_PREFIX = 'extension-';

const currentTarget = {
  handle: null,
  tabId: null,
  debugger: null,
  rootId: null,
  contextId: null,
};
const usedTabIds = new Set();
const debuggers = [];

const Targets = module.exports = {
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
    const getTargets = thenChrome.debugger.getTargets();
    const getEnabledExtensions = thenChrome.management.getAll()
      .then(items => items.filter(item => item.enabled && item.type === 'extension'));
    return Promise.all([getTargets, getEnabledExtensions])
      .then(([targets, enabledExtensions]) => {
        return targets
          .filter(target => filter.isCorrectTarget(target, enabledExtensions))
          .map(addHandle);
      });
  },

  getByProp(prop, value) {
    return this.getAllTargets()
      .then(targets => {
          const target = targets.filter(target => target[prop] === value)[0];
          return target || Promise.reject(`Target with ${prop} = '${value}' does not exist`);
      });
  },

  switchByTabId(tabId) {
    return this.switchByProp('tabId', tabId);
  },

  switchByHandle(handle) {
    return this.switchByProp('handle', handle);
  },

  switchByProp(prop, value) {
    return this.getByProp(prop, value)
      .then(target => {
        clearCurrentTarget();
        currentTarget.handle = target.handle;
        return target.extensionId
          ? switchToExtensionTarget(target)
          : switchToTabTarget(target);
      });
  },

  /**
   * If current target tab is loading, wait for complete
   */
  ensureComplete() {
    return currentTarget.tabId
      ? tabLoader.wait(currentTarget.tabId)
      : Promise.resolve();
  },

  /**
   * Registers target
   * @param {Number} tabId
   */
  registerTabId(tabId) {
    usedTabIds.add(tabId);
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
    target.handle = TAB_PREFIX + target.id;
  }
  if (target.type === 'background_page') {
    target.handle = EXTENSION_PREFIX + target.extensionId;
  }
  return target;
}

function switchToTabTarget(target) {
  logger.log('Switching to tab', target.tabId, target.url);
  currentTarget.tabId = target.tabId;
  Targets.registerTabId(target.tabId);
  return Promise.resolve()
    .then(() => thenChrome.tabs.update(target.tabId, {active: true}))
    .then(() => attachDebugger({tabId: target.tabId}));
}

function switchToExtensionTarget(target) {
  logger.log('Switching to extension', target.extensionId);
  currentTarget.tabId = null;
  return Promise.resolve()
    .then(() => attachDebugger({extensionId: target.extensionId}));
}

function switchToFrame(frameId) {
  // todo
}

function clearCurrentTarget() {
  Object.keys(currentTarget).forEach(key => currentTarget[key] = null);
}
