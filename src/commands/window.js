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
  return Promise.resolve()
    .then(() => getAllPages())
    .then(pages => {
      return pages
        .filter(page => page.tabId === TargetManager.tabId)
        .map(page => page.id)[0];
    });
}

function getAllWindowHandles() {
  return Promise.resolve()
    .then(() => getAllPages())
    .then(pages => pages.map(page => page.id));
}

function getAllPages() {
  return thenChrome.debugger.getTargets()
    .then(targets => {
      return targets
        // allowing 'background_page' type is extra feature to test chrome extensions
        // todo: add inactive background event pages
        .filter(target => target.type === 'page' || target.type === 'background_page')
        .filter(target => !target.url.startsWith('chrome-devtools://'))
        // exclude self background page and tabs
        .filter(target => !isSelfBackground(target) && !isSelfUi(target))
    });
}

function isSelfBackground(target) {
  return target.type === 'background_page' && target.extensionId === chrome.runtime.id;
}

function isSelfUi(target) {
  return target.type === 'page' && target.url === chrome.runtime.getURL('ui/index.html');
}
