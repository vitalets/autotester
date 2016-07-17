/**
 * Creates/updates tabs and waits for process finished (returns Promise)
 * Saves initial and final urls.
 */

const thenChrome = require('then-chrome');

// map of tabs that are currently waiting "complete" status
const tabs = new Map();

class TabLoader {
  /**
   * Init
   */
  static init() {
    chrome.tabs.onUpdated.addListener(TabLoader._onTabUpdated.bind(TabLoader));
  }
  /**
   * Creates new tab
   * @param {Object} info
   * @returns {Promise}
   */
  static create(info) {
    return thenChrome.tabs.create(info)
      .then(tab => TabLoader._createLoadingTab(tab));
  }
  /**
   * Updates tab
   * @param {Number} tabId
   * @param {Object} info
   * @returns {Promise}
   */
  static update(tabId, info) {
    return thenChrome.tabs.update(tabId, info)
      .then(tab => TabLoader._createLoadingTab(tab));
  }

  /**
   * Waits for existing tab to get loaded (receive 'complete' status)
   * @param {Number} tabId
   * @param {Boolean} force - wait for complete event even if tab in complete status now
   * @returns {Promise}
   */
  static wait(tabId, force = false) {
    return thenChrome.tabs.get(tabId)
      .then(tab => {
        if (tab.status === 'loading' || force) {
          TabLoader._createLoadingTab(tab);
        }
      });
  }

  static _onTabUpdated(tabId, changeInfo, tab) {
    if (tabs.has(tabId) && changeInfo.status === 'complete') {
      const info = tabs.get(tabId);
      tab.initialUrl = info.initialUrl;
      info.resolve(tab);
      tabs.delete(tabId);
    }
  }

  static _createLoadingTab(tab) {
    if (tabs.has(tab.id)) {
      const tabInfo = tabs.get(tab.id);
      // reject previous promise
      tabInfo.reject();
      tabs.delete(tab.id);
    }
    return new Promise((resolve, reject) => {
      const tabInfo = {resolve, reject, initialUrl: tab.url};
      tabs.set(tab.id, tabInfo);
    });
  }
}

module.exports = TabLoader;
