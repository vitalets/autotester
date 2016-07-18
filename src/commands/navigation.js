/**
 * Commands to manipulate page navigation
 */

const seleniumCommand = require('selenium-webdriver/lib/command');

const TabLoader = require('../tab-loader');
const TargetManager = require('../target-manager');

exports.commands = {
  [seleniumCommand.Name.GET]: navigate,
  [seleniumCommand.Name.GET_TITLE]: getTitle,
};

function navigate(params) {
  return TabLoader.update(TargetManager.tabId, {url: params.url});
}

function getTitle() {
  return thenChrome.tabs.get(TargetManager.tabId).then(tab => tab.title);
}
