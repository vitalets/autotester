/**
 * Commands to manipulate page navigation
 */

const TabLoader = require('../tab-loader');
const Targets = require('../targets');
const evaluate = require('./evaluate');

exports.go = function (params) {
  return TabLoader.update(Targets.tabId, {url: params.url}).then(() => {});
};

exports.getTitle = function () {
  return evaluate.execute({
    script: 'return document.title',
    args: [],
  });
};

exports.getCurrentUrl = function () {
  return evaluate.execute({
    script: 'return document.URL',
    args: [],
  });
};
