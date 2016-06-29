/**
 * Creates/updates tabs and waits for process finished (returns Promise)
 * Saves initial and final urls.
 */

class TabLoader {
  /**
   * Constructor
   */
  constructor() {
    this._tabs = new Map();
    chrome.tabs.onUpdated.addListener(this._onTabUpdated.bind(this));
  }
  /**
   * Creates new tab
   * @param {Object} info
   * @returns {Promise}
   */
  create(info) {
    return new Promise((resolve, reject) => {
      chrome.tabs.create(info, tab => this._createLoadingTab(tab, resolve, reject));
    });
  }
  /**
   * Updates tab
   * @param {Number} tabId
   * @param {Object} info
   * @returns {Promise}
   */
  update(tabId, info) {
    return new Promise((resolve, reject) => {
      chrome.tabs.update(tabId, info, tab => this._createLoadingTab(tab, resolve, reject));
    });
  }
  _onTabUpdated(tabId, changeInfo, tab) {
    if (this._tabs.has(tabId) && changeInfo.status === 'complete') {
      const info = this._tabs.get(tabId);
      tab.initialUrl = info.initialUrl;
      info.resolve(tab);
      this._tabs.delete(tabId);
    }
  }
  _createLoadingTab(tab, resolve, reject) {
    if (this._tabs.has(tab.id)) {
      const info = this._tabs.get(tab.id);
      // reject previous promise
      info.reject();
      this._tabs.delete(tab.id);
    }
    this._tabs.set(tab.id, {resolve, reject, initialUrl: tab.url});
  }
}
