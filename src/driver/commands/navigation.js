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
  return thenChrome.tabs.get(Targets.tabId).then(tab => tab.title);
};
