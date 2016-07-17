/**
 * Commands to manipulate page navigation
 */

const seleniumCommand = require('selenium-webdriver/lib/command');
const Command = require('./command');
const TabLoader = require('../tab-loader');

class Navigation extends Command {
  static navigate(params) {
    return TabLoader.update(Command.tabId, {url: params.url});
  }
  static getTitle() {
    return thenChrome.tabs.get(Command.tabId).then(tab => tab.title);
  }
  static exports() {
    return {
      [seleniumCommand.Name.GET]: Navigation.navigate,
      [seleniumCommand.Name.GET_TITLE]: Navigation.getTitle,
    };
  }
}

module.exports = Navigation;
