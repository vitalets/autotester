/**
 * Keyboard commands
 */

const seleniumCommand = require('selenium-webdriver/lib/command');
const TargetManager = require('../target-manager');

exports.commands = {
  [seleniumCommand.Name.SEND_KEYS_TO_ELEMENT]: sendKeys,
  //[seleniumCommand.Name.QUIT]: stop
};

function sendKeys(params) {
  // todo: scroll
  // todo: rawKeyPress
  const focused = focus(params.id);
  return params.value.reduce((res, char) => res.then(() => sendKey(char)), focused);
}

function sendKey(char) {
  return TargetManager.debugger.sendCommand('Input.dispatchKeyEvent', {
    modifiers: 0,
    nativeVirtualKeyCode: 0,
    text: char,
    type: 'char',
    unmodifiedText: char,
    windowsVirtualKeyCode: 0
  });
}

function focus(id) {
  return TargetManager.debugger.sendCommand('DOM.focus', {
    nodeId: Number(id)
  });
}
