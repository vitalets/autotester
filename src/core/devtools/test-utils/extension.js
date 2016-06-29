/**
 * Actions for testing chrome extensions
 */

window.extension = {
  uninstall() {
    return inspected.eval('chrome.management.uninstallSelf()');
  },
  reload() {
    return inspected.eval('chrome.runtime.reload()');
  }
};

