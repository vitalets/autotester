/**
 * Commands to manipulate page navigation
 */

const seleniumCommand = require('selenium-webdriver/lib/command');

const TabLoader = require('../tab-loader');
const TargetManager = require('../target-manager');

class Navigation {
  static navigate(params) {
    return TabLoader.update(TargetManager.tabId, {url: params.url});
  }
  static getTitle() {
    return thenChrome.tabs.get(TargetManager.tabId).then(tab => tab.title);
  }
  static exports() {
    return {
      [seleniumCommand.Name.GET]: Navigation.navigate,
      [seleniumCommand.Name.GET_TITLE]: Navigation.getTitle,
    };
  }
}

module.exports = Navigation;
