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

exports.getCurrentUrl = function () {
  return evaluate.executeScript({
    script: 'return document.URL',
    args: [],
  });
};
