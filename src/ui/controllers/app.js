/**
 * Main ui entry
 */

const mobx = require('mobx');
const store = require('../store').store;
const {APP_STATE, TAB} = require('../store/constants');
const bgApi = require('./bg-api');
const windowApi = require('./window-api');
const runController = require('./run');
const testsList = require('./tests-list');
const predefinedData = require('./predefined-data');

/**
 * Start app
 */
exports.start = function() {
  runController.init();
  bgApi.init();
  windowApi.init();
  return Promise.resolve()
    .then(() => predefinedData.storeOnFirstRun())
    .then(() => store.load())
    .then(() => store.isSnippets() ? null : testsList.load())
    .then(mobx.action(ready));
};

function ready() {
  store.appState = APP_STATE.READY;
  //store.selectedTab = TAB.TESTS;
  store.selectedTab = TAB.SETTINGS;
}

// todo: move somewhere
function welcome() {
  const buildNumber = chrome.extension.getBackgroundPage().__buildInfo.buildNumber;
  const msg = [
    `Welcome to **Autotester**${buildNumber ? ' (build #**' + buildNumber + '**)' : ''}!\n`,
    `For convenient testing please enable two **chrome flags**:\n`,
    `[silent-debugger-extension-api](chrome://flags#silent-debugger-extension-api) - to remove annoying bar about using debugger api\n`,
    `[extensions-on-chrome-urls](chrome://flags#extensions-on-chrome-urls) - to allow testing other chrome extensions`,
  ].join('');
  htmlConsole.log(msg);
}
