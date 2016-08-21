/**
 * Commands for switching between windows (tabs).
 * For selenium window === tab.
 */

const TabLoader = require('../tab-loader');
const Targets = require('../targets');

/**
 * Switch to window, tab or extension background page
 *
 * @param {Object} params
 * @param {String} params.name
 */
exports.switchToWindow = function (params) {
  return Targets.switchByHandle(params.name);
};

/**
 * Switch new tab
 *
 * @param {Object} params
 * @param {String} params.url
 * @returns {Promise}
 */
exports.switchToNewTab = function (params) {
  return Promise.resolve()
    .then(() => TabLoader.create({url: params.url}))
    .then(tab => Targets.switchByTabId(tab.id));
};
