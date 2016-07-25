/**
 * Commands to get info and manipulate window(s) and tabs(s)
 * For selenium window === tab.
 */

const seleniumCommand = require('selenium-webdriver/lib/command');
const thenChrome = require('then-chrome');
const TargetManager = require('../target-manager');

exports.commands = {
  [seleniumCommand.Name.GET_CURRENT_WINDOW_HANDLE]: getCurrentWindowHandle,
  [seleniumCommand.Name.GET_WINDOW_HANDLES]: getAllWindowHandles,
};

exports.getAllPages = getAllPages;

function getCurrentWindowHandle() {
  return getAllPages()
    .then(pages => {
      return pages
        .filter(page => page.tabId === TargetManager.tabId)
        .map(page => page.id)[0];
    });
}

function getAllWindowHandles() {
  return getAllPages()
    .then(pages => pages.map(page => page.id));
}

function getAllPages() {
  return thenChrome.debugger.getTargets()
    .then(targets => {
      return targets
        // allowing 'background_page' type is extra feature to test chrome extensions
        .filter(target => target.type === 'page' || target.type === 'background_page')
        // todo: exclude autotester tab
        .filter(target => !target.url.startsWith('chrome-devtools://'))
    });
}
