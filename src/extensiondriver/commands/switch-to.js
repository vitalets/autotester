/**
 * Commands for switching between windows (tabs).
 * For selenium window === tab.
 */

const TabLoader = require('../tab-loader');
const Targets = require('../targets');

// initial url when opening new tab
const INITIAL_URL = 'about:blank';

/**
 * Switch to window, tab or extension background page
 *
 * @param {Object} params
 * @param {String} params.name
 */
exports.window = function (params) {
  return Targets.switchByHandle(params.name);
};

/**
 * Switch new tab
 *
 * @param {Object} params
 * @param {String} params.url
 * @returns {Promise}
 */
exports.newTab = function (params = {}) {
  return Promise.resolve()
    .then(() => TabLoader.create({url: params.url || INITIAL_URL}))
    .then(tab => Targets.switchByTabId(tab.id));
};

/**
 * Switch extension with specified id or first found extension if id is empty
 *
 * @param {Object} params
 * @param {String} [params.id]
 * @returns {Promise}
 */
exports.extension = function (params = {}) {
  return Targets.switchByExtensionId(params.id);
};
