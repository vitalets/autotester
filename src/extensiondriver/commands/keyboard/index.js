/**
 * Keyboard commands
 */

const Targets = require('../../targets');
const modifiers = require('./modifiers');
const dispatcher = require('./dispatcher');

// temp solution to support enter
const keycodes = require('./keycodes');
const Key = require('selenium-webdriver/lib/input').Key;

/**
 * @param {Object} params
 * @param {String} params.id
 * @param {Array} params.value
 */
exports.sendKeysToElement = function (params) {
  // todo: scroll
  return Promise.resolve()
    .then(() => {
      // try to set focus if possible
      return focus(params.id)
        .catch(e => e.message.indexOf('Element is not focusable') ? null : Promise.reject(e))
    })
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
  const indexOfChar = keycodes.indexOf(char.toLocaleUpperCase());
  const keyCode = indexOfChar >= 0 ? indexOfChar : 0;

  if (char === Key.ENTER) {
    char = '\r';
  }


  // todo: get text/unmodified text
  return Promise.resolve()
    .then(() => dispatchShift ? modifiers.dispatchShift('keydown') : null)
    .then(() => dispatcher.dispatchKeyDown(keyCode, modifiers.get()))
    .then(() => dispatcher.dispatchChar(char, modifiers.get()))
    .then(() => dispatcher.dispatchKeyUp(keyCode, modifiers.get()))
    .then(() => dispatchShift ? modifiers.dispatchShift('keyup') : null);
}

function focus(id) {
  return Targets.debugger.sendCommand('DOM.focus', {
    nodeId: Number(id)
  });
}
