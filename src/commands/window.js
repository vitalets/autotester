/**
 * Commands to get info and manipulate window(s) and tabs(s)
 * For selenium window === tab.
 */

const thenChrome = require('then-chrome');
const TargetManager = require('../target-manager');

// todo: move to target manager
exports.getAllTargets = getAllTargets;

exports.getCurrentWindowHandle = function () {
  return Promise.resolve(TargetManager.handle);
};

exports.getAllWindowHandles = function () {
  return Promise.resolve()
    .then(() => getAllTargets())
    .then(targets => targets.map(target => target.handle));
};

function getAllTargets() {
  return thenChrome.debugger.getTargets()
    .then(targets => {
      return targets
        // todo: add inactive background event pages
        .filter(target => isSuitableType(target))
        .filter(target => !isDevtools(target))
        .filter(target => !isAutotester(target))
        .map(target => addHandle(target))
    });
}

function isSuitableType(target) {
  // allowing 'background_page' type is extra feature to test chrome extensions
  return target.type === 'page' || target.type === 'background_page';
}

function isDevtools(target) {
  return target.url.startsWith('chrome-devtools://');
}

function isAutotester(target) {
  return isAutotesterBg(target) || isAutotesterUi(target);
}

function isAutotesterBg(target) {
  return target.type === 'background_page' && target.extensionId === chrome.runtime.id;
}

function isAutotesterUi(target) {
  return target.type === 'page' && target.url === chrome.runtime.getURL('ui/index.html');
}

function addHandle(target) {
  if (target.type === 'page') {
    target.handle = target.id;
  }
  if (target.type === 'background_page') {
    target.handle = target.extensionId;
  }
  return target;
}
