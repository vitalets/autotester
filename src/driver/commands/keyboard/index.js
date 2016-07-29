/**
 * Keyboard commands
 */

const TargetManager = require('../../target-manager');
const modifiers = require('./modifiers');
const dispatcher = require('./dispatcher');

/**
 * @param {Object} params
 * @param {String} params.id
 * @param {Array} params.value
 */
exports.sendKeysToElement = function (params) {
  // todo: scroll
  return focus(params.id)
    .then(() => exports.sendKeysToActiveElement(params))
    .then(() => modifiers.release());
};

/**
 * @param {Object} params
 * @param {Array} params.value
 */
exports.sendKeysToActiveElement = function (params) {
  return params.value.reduce((res, char) => res.then(() => sendKey(char)), Promise.resolve());
};

function sendKey(char) {
  if (modifiers.isModifier(char)) {
    return modifiers.toggle(char);
  }

  if (modifiers.isReleaseChar(char)) {
    return modifiers.release();
  }

  // todo: non-printable keys (keyboard commands)

  // taken from firefox driver
  // https://github.com/SeleniumHQ/selenium/blob/master/javascript/firefox-driver/js/utils.js#L441
  // todo: what about non-latin chars?
  const isShiftedChar = /[A-Z\!\$\^\*\(\)\+\{\}\:\?\|~@#%&_"<>]/.test(char);
  const dispatchShift = isShiftedChar && !modifiers.hasShift();
  // todo: find true way to get keyCode
  const keyCode = 0;
  // todo: get text/unmodified text
  return Promise.resolve()
    .then(() => dispatchShift ? modifiers.dispatchShift('keydown') : null)
    .then(() => dispatcher.dispatchKeyDown(keyCode, modifiers.get()))
    .then(() => dispatcher.dispatchChar(char, modifiers.get()))
    .then(() => dispatcher.dispatchKeyUp(keyCode, modifiers.get()))
    .then(() => dispatchShift ? modifiers.dispatchShift('keyup') : null);
}

function focus(id) {
  return TargetManager.debugger.sendCommand('DOM.focus', {
    nodeId: Number(id)
  });
}
