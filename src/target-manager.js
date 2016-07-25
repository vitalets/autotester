/**
 * Manager for command targets.
 * Store actual info for targeting commands and list of debuggers.
 * Command target has several properties:
 * - tabId
 * - attached debugger
 * - root nodeId
 * - execution context id
 * - ...
 *
 * It's a static singleton class for convenient access from any command.
 */

// todo: rewirte as simple exports.*

const thenChrome = require('then-chrome');
const Debugger = require('./debugger');

let debuggers = [];
let currentTabId = null;
let currentDebugger = null;
let currentRootId = null;

class TargetManager {

  static reset() {
    debuggers = [];
    currentTabId = null;
    currentDebugger = null;
    currentRootId = null;
  }

  static get tabId() {
    return currentTabId;
  }

  static get debuggers() {
    return debuggers;
  }

  static get debugger() {
    return currentDebugger;
  }

  static get rootId() {
    return currentRootId;
  }

  static set rootId(value) {
    currentRootId = value;
  }

  static switchToTab(tabId) {
    currentTabId = tabId;
    currentRootId = null;
    return Promise.resolve()
      .then(() => thenChrome.tabs.update(tabId, {active: true}))
      .then(() => TargetManager.attachDebugger({tabId}));
  }

  static switchToFrame(frameId) {
    // todo
  }

  static switchToExtension(extensionId) {
    // todo
  }

  static attachDebugger(target) {
    const existingDebugger = this.debuggers.filter(d => d.isAttachedTo(target))[0];
    if (existingDebugger) {
      currentDebugger = existingDebugger;
      return Promise.resolve();
    } else {
      currentDebugger = new Debugger();
      debuggers.push(currentDebugger);
      return currentDebugger.attach(target);
    }
  }
}

module.exports = TargetManager;
