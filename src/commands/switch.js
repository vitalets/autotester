/**
 * Commands for switching between windows (tabs).
 * For selenium window === tab.
 */

const seleniumCommand = require('selenium-webdriver/lib/command');
const TargetManager = require('../target-manager');
const windowCommand = require('./window');

exports.commands = {
  [seleniumCommand.Name.SWITCH_TO_WINDOW]: switchToWindow,
};

exports.switchByTabId = switchByTabId;

/**
 * Switch to window, tab or extension background page
 *
 * @param {Object} params
 * @param {String} params.name
 */
function switchToWindow(params) {
  return switchByProp('handle', params.name);
}

function switchByTabId(tabId) {
  return switchByProp('tabId', tabId);
}

function switchByProp(prop, value) {
  return windowCommand.getAllTargets()
    .then(targets => {
      const target = targets.filter(target => target[prop] === value)[0];
      return target
        ? TargetManager.switchTo(target)
        : Promise.reject(`Window with ${prop} = '${value}' does not exist`);
    });
}
