/**
 * Main ui file
 */

const thenChrome = require('then-chrome');
const mobx = require('mobx');
const store = require('../store').store;
const {APP_STATE, TAB} = require('../store/constants');
const messaging = require('../../background/messaging');

const {
  BG_LOAD_DONE,
  LOAD_TESTS_CONFIG,
  RUN_TESTS,
  RUN_TESTS_DONE,
  SELECT_TEST,
  LOAD_TESTS_CONFIG_DONE,
  RUN_TESTS_STARTED,
} = messaging.names;

module.exports = class Main {
  run() {
    store.load()
      .then(() => {
        this._setListeners();
        return this._requestConfig();
        // load config
        // store.appState = APP_STATE.READY
      });
  }
  _requestConfig() {
    messaging.send(LOAD_TESTS_CONFIG);
  }
  _setListeners() {
    messaging.start();
    // always reload ui if bg reloaded
    messaging.on(BG_LOAD_DONE, () => location.reload());
    //messaging.on(LOAD_TESTS_CONFIG_DONE, onConfigLoaded);
    messaging.on(LOAD_TESTS_CONFIG_DONE, mobx.action(onConfigLoaded));
    //messaging.on(RUN_TESTS_DONE, onTestsDone);
  }
};

function onConfigLoaded(data = {}) {
  console.log('config loaded', data.config.tests.length);
  store.tests = data.config.tests || [];
  if (store.selectedTest && store.tests.indexOf(store.selectedTest) === -1) {
    store.selectedTest = '';
  }
  store.appState = APP_STATE.READY;
  /*
  if (data.error) {
    htmlConsole.warn(data.error);
  } else {
    const msg = [
      `Config successfully loaded from: **${data.config.url}**`,
      `Test files found: **${data.config.tests.length}**`,
    ].join('\n');
    htmlConsole.info(msg);
    */
}

/*


const messaging = require('../background/messaging');
const api = require('./app/api');


function start() {

  smartUrlOpener.listen();
  messaging.start();
  api.setup();


  welcome();

  // for programmatic run
  // todo: move to api
  window.runTests = runTests;
}
*/

/**
 * Run tests from files
 *
 * @param {Array<{code, path}>} [files] for running custom code snippets
 * todo: split to runSnippets / runFiles
 */
function runTests(files) {
  if (files && !Array.isArray(files)) {
    throw new Error('files should be array');
  }
  sharedConsole.clear();
  window.report.innerHTML = '';
  const eventData = {
    files,
    targetId: document.getElementById('targets').value,
    selectedTest: document.getElementById('testlist').value,
    noQuit: document.getElementById('no-quit').checked
  };
  messaging.send(RUN_TESTS, eventData);
}

function loadConfig() {
  messaging.send(LOAD_TESTS_CONFIG);
}

function activateSelfTab() {
  return thenChrome.tabs.getCurrent()
    .then(tab => thenChrome.tabs.update(tab.id, {active: true}));
}

/*
function onConfigLoaded(data = {}) {
  if (data.error) {
    htmlConsole.warn(data.error);
  } else {
    const msg = [
      `Config successfully loaded from: **${data.config.url}**`,
      `Test files found: **${data.config.tests.length}**`,
    ].join('\n');
    htmlConsole.info(msg);
  }
}
*/

function onTestsDone() {
  activateSelfTab();
}

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
