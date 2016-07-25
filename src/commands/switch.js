/**
 * Commands for switching between windows (tabs).
 * For selenium window === tab.
 */

const seleniumCommand = require('selenium-webdriver/lib/command');
const TargetManager = require('../target-manager');
const windowCommand = require('./window');

exports.commands = {
  [seleniumCommand.Name.SWITCH_TO_WINDOW]: switchToWindow,
};

/**
 * Switch to window, tab or extension background page
 *
 * @param {Object} params
 * @param {String} params.name
 */
function switchToWindow(params) {
  return windowCommand.getAllPages()
    .then(pages => {
      const page = pages.filter(page => page.id === params.name)[0];
      if (page) {
        return TargetManager.switchToTab(page.tabId);
      } else {
        throw new Error('Window does not exist');
      }
    })
}

/**
 * Native selenium does not support tabs but Autotester does.
 * see: https://github.com/SeleniumHQ/selenium/issues/2247
 * see: https://github.com/SeleniumHQ/selenium/issues/399
 * @param tabId
 * @returns {Promise.<T>}
 */
function switchToTab() {
  // _targetManager.switchToTab()
  // _targetManager.currentTarget()
}

//
//switchToTab(tabId) {
//  this._currentTabId = tabId;
//  this._currentRootId = null;
//  return thenChrome.tabs.update(tabId, {active: true})
//    .then(() => this._attachDebugger({tabId}));
//}


