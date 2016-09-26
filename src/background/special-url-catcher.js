/**
 * Catches special url 'http://autotester' to launch ui
 */

const thenChrome = require('then-chrome');
const constants = require('./constants');

const SPECIAL_HOSTNAME = 'autotester';

exports.start = function () {
  if (!isSelfTest()) {
    listenTabUpdated();
    findSpecialTab()
      .then(tab => tab ? openUi(tab) : null);
  }
};

function findSpecialTab() {
  return thenChrome.tabs.query({})
    .then(tabs => tabs.find(isSpecialTab))
}

function isSpecialTab(tab) {
  try {
    const urlObj = new URL(tab.url);
    return urlObj.hostname === SPECIAL_HOSTNAME;
  } catch (e) {
    return false;
  }
}

function openUi(tab) {
  thenChrome.tabs.update(tab.id, {url: constants.UI_URL, active: true});
}

function listenTabUpdated() {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading' && isSpecialTab(tab)) {
      openUi(tab);
    }
  });
}

/**
 * For self test build dont catch special url
 */
function isSelfTest() {
  return chrome.runtime.getManifest().name.indexOf('SELF TEST') === 0;
}
