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
  /**
   *
   * @param {Object} options
   * todo: @param {Boolean} [options.readExistingTabs]
   */
  start(options) {
    this._setListeners(true);
    this._tabs.length = 0;
    // todo: thenChrome.tabs.query({status: 'loading'}).then(...);
  }
  stop() {
    this._setListeners(false);
    return this._tabs.slice();
  }
  _onTabCreated(tab) {
    this._getOrCreateTab(tab.id, 'created');
  }
  _onTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      const tabInfo = this._getOrCreateTab(tab.id, 'updated');
      tabInfo.url = tab.url;
    }
  }
  _onBeforeNavigate(details) {
    if (details.frameId === 0) {
      const tabInfo = this._getOrCreateTab(details.tabId, 'updated');
      tabInfo.initialUrl = details.url;
    }
  }
  _getOrCreateTab(tabId, action) {
    let tab = this._tabs.find(tab => tab.id === tabId);
    if (!tab) {
      tab = {id: tabId, action: action};
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
