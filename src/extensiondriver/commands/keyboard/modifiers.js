/**
 * Manage modifiers state (Alt, Ctrl, Shift, Command/Meta).
 * State is shared between all windows
 */

const Key = require('selenium-webdriver/lib/input').Key;
const dispatcher = require('./dispatcher');

// modifiers info
const MODIFIERS = {
  [Key.ALT]: {debuggerValue: 1, keyCode: 18},
  [Key.CONTROL]: {debuggerValue: 2, keyCode: 17},
  [Key.SHIFT]: {debuggerValue: 8, keyCode: 16},
  [Key.COMMAND]: {debuggerValue: 4, keyCode: 91},
};

// current state of modifiers
const state = {
  [Key.ALT]: false,
  [Key.CONTROL]: false,
  [Key.SHIFT]: false,
  [Key.COMMAND]: false,
};

/**
 * Is passed char modifier
 *
 * @param {String} char
 * @returns {Boolean}
 */
exports.isModifier = function (char) {
  return MODIFIERS.hasOwnProperty(char);
};

/**
 * Toggles modifier
 *
 * @param {String} char
 * @returns {Promise}
 */
exports.toggle = function (char) {
  const modifier = MODIFIERS[char];
  const isReleasing = state[char];
  state[char] = !state[char];
  return isReleasing
    ? dispatcher.dispatchKeyUp(modifier.keyCode, exports.get())
    : dispatcher.dispatchKeyDown(modifier.keyCode, exports.get());
};

/**
 * Release all needed modifiers by sending 'keyUp'
 */
exports.release = function () {
  const tasks = Object.keys(MODIFIERS)
    .filter(char => state[char])
    .map(char => exports.toggle(char));
  return Promise.all(tasks);
};

/**
 * Special selemium char to release modifiers
 *
 * @param {String} char
 * @returns {Boolean}
 */
exports.isReleaseChar = function (char) {
  return char === Key.NULL;
};

/**
 * Returns current modifiers bit sum for debugger 'dispatchKeyEvent' command
 * See: https://chromedevtools.github.io/debugger-protocol-viewer/tot/Input/
 *
 * @returns {Number}
 */
exports.get = function () {
  return Object.keys(MODIFIERS).reduce((res, char) => {
    return state[char] ? res + MODIFIERS[char].debuggerValue : res;
  }, 0);
};

/**
 * If shift pressed now
 * @returns {Boolean}
 */
exports.hasShift = function () {
  return state[Key.SHIFT];
};

/**
 * Dispatch shift event without saving to state
 * @param {String} phase keydown|keyup
 */
exports.dispatchShift = function (phase) {
  const modifier = MODIFIERS[Key.SHIFT];
  return phase === 'keyup'
    ? dispatcher.dispatchKeyUp(modifier.keyCode, exports.get())
    : dispatcher.dispatchKeyDown(modifier.keyCode, exports.get());
};
