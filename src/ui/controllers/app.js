/**
 * Main ui entry
 */

const mobx = require('mobx');
const store = require('../store').store;
const {APP_STATE, TAB} = require('../store/constants');
const bgApi = require('./bg-api');
const windowApi = require('./window-api');
const testsRun = require('./tests-run');
const testsList = require('./tests-list');
const htmlConsole = require('./html-console');
const setup = require('./setup');

/**
 * Start app
 */
exports.start = function() {
  htmlConsole.init();
  testsRun.init();
  bgApi.init();
  windowApi.init();
  return Promise.resolve()
    .then(() => setup.applyOnFirstRun())
    .then(() => store.load())
    .then(() => store.isSnippets() ? null : testsList.load())
    .then(mobx.action(ready));
};

function ready() {
  store.appState = APP_STATE.READY;
  store.selectedTab = TAB.TESTS;
}
