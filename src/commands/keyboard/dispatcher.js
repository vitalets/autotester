/**
 * Helper to dispatch keyboard commands
 */

const TargetManager = require('../../target-manager');

exports.dispatchChar = function (char, modifiers = 0) {
  return dispatchKeyEvent({
    modifiers: modifiers,
    nativeVirtualKeyCode: 0,
    text: char,
    type: 'char',
    unmodifiedText: char,
    windowsVirtualKeyCode: 0
  });
};

exports.dispatchKeyDown = function (keyCode, modifiers = 0) {
  return dispatchKeyEvent({
    modifiers: modifiers,
    nativeVirtualKeyCode: keyCode,
    text: '',
    type: 'rawKeyDown',
    unmodifiedText: '',
    windowsVirtualKeyCode: keyCode
  });
};

exports.dispatchKeyUp = function (keyCode, modifiers = 0) {
  return dispatchKeyEvent({
    modifiers: modifiers,
    nativeVirtualKeyCode: keyCode,
    text: '',
    type: 'keyUp',
    unmodifiedText: '',
    windowsVirtualKeyCode: keyCode
  });
};

function dispatchKeyEvent(options) {
  return TargetManager.debugger.sendCommand('Input.dispatchKeyEvent', options);
}
