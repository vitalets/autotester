

/**
 * Native selenium does not support tabs but Autotester does.
 * see: https://github.com/SeleniumHQ/selenium/issues/2247
 * see: https://github.com/SeleniumHQ/selenium/issues/399
 * @param tabId
 * @returns {Promise.<T>}
 */
function toTab() {
  // _targetManager.switchToTab()
  // _targetManager.currentTarget()
}

function toFrame() {

}

switchToTab(tabId) {
  this._currentTabId = tabId;
  this._currentRootId = null;
  return thenChrome.tabs.update(tabId, {active: true})
    .then(() => this._attachDebugger({tabId}));
}


