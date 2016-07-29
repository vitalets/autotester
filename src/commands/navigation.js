/**
 * Commands to manipulate page navigation
 */

const thenChrome = require('then-chrome');
const TabLoader = require('../tab-loader');
const TargetManager = require('../target-manager');

exports.navigate = function (params) {
  return TabLoader.update(TargetManager.tabId, {url: params.url});
};

exports.getTitle = function () {
  return thenChrome.tabs.get(TargetManager.tabId).then(tab => tab.title);
};
