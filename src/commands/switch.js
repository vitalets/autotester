/**
 * Commands for switching between windows (tabs).
 * For selenium window === tab.
 */

const TargetManager = require('../target-manager');
const windowCommand = require('./window');

/**
 * Switch to window, tab or extension background page
 *
 * @param {Object} params
 * @param {String} params.name
 */
exports.switchToWindow = function (params) {
  return switchByProp('handle', params.name);
};

/**
 * Switch to tab by id
 *
 * @param {Number} tabId
 */
exports.switchByTabId = function (tabId) {
  return switchByProp('tabId', tabId);
};

function switchByProp(prop, value) {
  return windowCommand.getAllTargets()
    .then(targets => {
      const target = targets.filter(target => target[prop] === value)[0];
      return target
        ? TargetManager.switchTo(target)
        : Promise.reject(`Window with ${prop} = '${value}' does not exist`);
    });
}
