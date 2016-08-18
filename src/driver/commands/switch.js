/**
 * Commands for switching between windows (tabs).
 * For selenium window === tab.
 */

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
