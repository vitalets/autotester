/**
 * Commands to manipulate page navigation
 */

const TabLoader = require('../tab-loader');
const Targets = require('../targets');
const evaluate = require('./evaluate');

exports.navigate = function (params) {
  return TabLoader.update(Targets.tabId, {url: params.url});
};

exports.getTitle = function () {
  return evaluate.executeScript({
    script: 'return document.title',
    args: [],
  });
};

// todo: switch to it automatically ?
// todo: register it in Targets anyway to close after test end
exports.newTab = function (params) {
  return TabLoader.create({url: params.url});
};
