/**
 * Commands to manipulate page navigation
 */

const thenChrome = require('then-chrome');
const TabLoader = require('../tab-loader');
const Targets = require('../targets');

exports.navigate = function (params) {
  return TabLoader.update(Targets.tabId, {url: params.url});
};

exports.getTitle = function () {
  // todo: use document.title as extension background pages is not a tab
  return thenChrome.tabs.get(Targets.tabId).then(tab => tab.title);
};

// todo: switch to it automatically ?
// todo: register it in Targets anyway to close after test end
exports.newTab = function (params) {
  return TabLoader.create({url: params.url});
};
