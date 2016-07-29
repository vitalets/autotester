/**
 * Commands for switching between windows (tabs).
 * For selenium window === tab.
 */

const TargetManager = require('../target-manager');

/**
 * Switch to window, tab or extension background page
 *
 * @param {Object} params
 * @param {String} params.name
 */
exports.switchToWindow = function (params) {
  return TargetManager.switchByProp('handle', params.name);
};
