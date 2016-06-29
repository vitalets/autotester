/**
 * Catches tab creating/updating
 * Saves initial and final urls.
 */

class TabCatcher {
  /**
   * Constructor
   */
  constructor() {
    this._tabs = [];
    this._onTabCreated = this._onTabCreated.bind(this);
    this._onTabUpdated = this._onTabUpdated.bind(this);
    this._onBeforeNavigate = this._onBeforeNavigate.bind(this);
  }
  start() {
    this._setListeners(true);
    this._tabs.length = 0;
  }
  stop() {
    this._setListeners(false);
    return this._tabs.slice();
  }
  _onTabCreated(tab) {
    const tabInfo = this._getOrCreateTab(tab.id);
    // if catched tab created --> mark it as created
    tabInfo.action = 'created';
  }
  _onTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      const tabInfo = this._getOrCreateTab(tab.id);
      tabInfo.url = tab.url;
    }
  }
  _onBeforeNavigate(details) {
    if (details.frameId === 0) {
      const tabInfo = this._getOrCreateTab(details.tabId);
      tabInfo.initialUrl = details.url;
    }
  }
  _getOrCreateTab(tabId) {
    let tab = this._tabs.find(tab => tab.id === tabId);
    if (!tab) {
      tab = {id: tabId, action: 'updated'};
      this._tabs.push(tab);
    }
    return tab;
  }
  _setListeners(enable = true) {
    const method = enable ? 'addListener' : 'removeListener';
    chrome.tabs.onCreated[method](this._onTabCreated);
    chrome.tabs.onUpdated[method](this._onTabUpdated);
    /**
     * WebNavigation is required to catch initial url when tab is updated
     * because chrome.tabs.onUpdated does not catch it
     */
    chrome.webNavigation.onBeforeNavigate[method](this._onBeforeNavigate);
  }
}
