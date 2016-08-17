/**
 * Map selenium commands to implementation
 */

const cmd = require('selenium-webdriver/lib/command').Name;
const extraCmd = require('./extra');

const session = require('./session');
const switchCommand = require('./switch');
const windowCommand = require('./window');
const navigation = require('./navigation');
const mouse = require('./mouse');
const keyboard = require('./keyboard');
const elementSearch = require('./element-search');
const element = require('./element');
const evaluate = require('./evaluate');
const timeouts = require('./timeouts');

module.exports = {
  [cmd.NEW_SESSION]: session.start,
  [cmd.QUIT]: session.stop,

  [cmd.SWITCH_TO_WINDOW]: switchCommand.switchToWindow,

  [cmd.GET_CURRENT_WINDOW_HANDLE]: windowCommand.getCurrentWindowHandle,
  [cmd.GET_WINDOW_HANDLES]: windowCommand.getAllWindowHandles,

  [cmd.GET]: navigation.navigate,
  [cmd.GET_TITLE]: navigation.getTitle,

  [cmd.CLICK_ELEMENT]: mouse.clickElement,
  [cmd.CLICK]: mouse.click,
  [cmd.DOUBLE_CLICK]: mouse.doubleClick,
  [cmd.MOVE_TO]: mouse.moveTo,

  // [cmd.GET_ACTIVE_ELEMENT]: elementSearch.start,
  [cmd.FIND_ELEMENT]: elementSearch.findElement,
  [cmd.FIND_ELEMENTS]: elementSearch.findElements,
  [cmd.FIND_CHILD_ELEMENT]: elementSearch.findChildElement,
  [cmd.FIND_CHILD_ELEMENTS]: elementSearch.findChildElements,

  [cmd.SEND_KEYS_TO_ELEMENT]: keyboard.sendKeysToElement,
  [cmd.SEND_KEYS_TO_ACTIVE_ELEMENT]: keyboard.sendKeysToActiveElement,

  [cmd.GET_ELEMENT_TEXT]: element.getElementText,
  [cmd.GET_ELEMENT_TAG_NAME]: element.getElementTagName,

  [cmd.EXECUTE_SCRIPT]: evaluate.executeScript,
  [cmd.EXECUTE_ASYNC_SCRIPT]: evaluate.executeAsyncScript,

  [cmd.SET_TIMEOUT]: timeouts.setTimeout,

  // ==== Extra commands - not supported by selenium! ====
  [extraCmd.NEW_TAB]: navigation.newTab,
};
