/**
 * Manager for command targets
 * Command target has several porperties:
 * - tabId
 * - attached debugger
 * - root nodeId
 * - execution context id
 */

const thenChrome = require('then-chrome');
const Debugger = require('./debugger');

class TargetManager {

  constructor() {
    this.debuggers = [];
    this.currentTabId = null;
    this.currentDebugger = null;
    this.currentRootId = null;
  }

  switchToTab(tabId) {
    this.currentTabId = tabId;
    this.currentRootId = null;
    return thenChrome.tabs.update(tabId, {active: true})
      .then(() => this.attachDebugger({tabId}));
  }

  switchToWindow(windowId) {
    // todo
  }

  switchToFrame(frameId) {
    // todo
  }

  switchToExtension(extensionId) {
    // todo
  }

  attachDebugger(target) {
    const existingDebugger = this.debuggers.filter(d => d.isAttachedTo(target))[0];
    if (existingDebugger) {
      this.currentDebugger = existingDebugger;
      return Promise.resolve();
    } else {
      this.currentDebugger = new Debugger();
      this.debuggers.push(this.currentDebugger);
      return this.currentDebugger.attach(target);
    }
  }
}

module.exports = TargetManager;
