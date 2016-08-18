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

/**
 * Opens new tab
 *
 * @param {Object} params
 * @param {String} params.url
 * @returns {Promise}
 */
exports.newTab = function (params) {
  return Promise.resolve()
    .then(() => TabLoader.create({url: params.url}))
    .then(tab => {
      Targets.registerTabId(tab.id);
      return Targets.getByProp('tabId', tab.id);
    })
    .then(target => target.handle);
};
