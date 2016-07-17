/**
 * Base static class for all commands.
 * Has useful methods for accessing current target.
 */

let targetManager = null;

class Command {
  static get targetManager() {
    return targetManager;
  }
  static set targetManager(value) {
    targetManager = value;
  }
  static get tabId() {
    return targetManager.currentTabId;
  }
  static get debugger() {
    return targetManager.currentDebugger;
  }
  static exports() {
    // should be defined in children
  }
}

module.exports = Command;
