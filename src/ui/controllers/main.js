/**
 * Main ui file
 */

const store = require('../store').store;
const {APP_STATE} = require('../store/constants');

module.exports = class Main {
  run() {
    console.log(store.appState);
    store.appState = APP_STATE.READY;
  }
};

/*

const thenChrome = require('then-chrome');
const messaging = require('../background/messaging');
const api = require('./app/api');
const smartUrlOpener = require('../utils/smart-url-opener');


const store = require('./store').store;
const {APP_STATE} = require('./store/constants');


function start() {

  smartUrlOpener.listen();
  messaging.start();
  api.setup();

  messaging.on(LOAD_TESTS_CONFIG_DONE, onConfigLoaded);
  messaging.on(RUN_TESTS_DONE, onTestsDone);
  messaging.on(BG_LOAD_DONE, () => location.reload());

  welcome();

  loadConfig();

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

function onConfigLoaded(data = {}) {
  if (data.error) {
    htmlConsole.warn(data.error);
  } else {
    const msg = [
      `Config successfully loaded from: **${data.config.url}**`,
      `Test files found: **${data.config.tests.length}**`,
    ].join('\n');
    htmlConsole.info(msg);
    fillTestList(data);
  }
}

function onTestsDone() {
  activateSelfTab();
}

function onTestSelected(event) {
  messaging.send(SELECT_TEST, {name: event.target.value});
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
