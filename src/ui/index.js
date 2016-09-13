/**
 * Main ui file
 */

const thenChrome = require('then-chrome');
const messaging = require('../background/messaging');
const title = require('./title');
const api = require('./api');
const smartUrlOpener = require('../utils/smart-url-opener');

const {
  BG_LOAD_DONE,
  LOAD_TESTS_CONFIG,
  RUN_TESTS,
  RUN_TESTS_DONE,
  SELECT_TEST,
  LOAD_TESTS_CONFIG_DONE,
} = messaging.names;

start();

function start() {
  document.getElementById('run').addEventListener('click', () => runTests());
  document.getElementById('testlist').addEventListener('change', onTestSelected);

  smartUrlOpener.listen();
  title.setListeners();
  messaging.start();
  api.setup();

  messaging.on(LOAD_TESTS_CONFIG_DONE, onConfigLoaded);
  messaging.on(RUN_TESTS_DONE, onTestsDone);
  messaging.on(BG_LOAD_DONE, () => location.reload());

  welcome();

  loadConfig();

  fillCaps();

  // for programmatic run
  // todo: move to api
  window.runTests = runTests;
}

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
    capsId: document.getElementById('caps').value,
    selectedTest: document.getElementById('testlist').value,
    noQuit: document.getElementById('no-quit').checked
  };
  title.set(title.MSG_RUNNING);
  messaging.send(RUN_TESTS, eventData);
}

function loadConfig() {
  title.set(title.MSG_LOADING);
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

function fillTestList(data) {
  const el = document.getElementById('testlist');
  el.options.length = 0;
  if (!data.config.tests.length) {
    el.disabled = true;
    return;
  } else {
    el.disabled = false;
  }
  const firstItem = {value: '', text: 'All'};
  const testItems = data.config.tests.map(test => {
    return {value: test, text: test};
  });
  const items = [firstItem].concat(testItems);

  items.forEach(item => {
    const option = new Option(item.text, item.value, false, item.value === data.selectedTest);
    return el.options[el.options.length] = option;
  });
}

function onTestsDone() {
  activateSelfTab();
}

function onTestSelected(event) {
  messaging.send(SELECT_TEST, {name: event.target.value});
}

function fillCaps() {
  const el = document.getElementById('caps');
  el.options.length = 0;
  const items = [
    {text: 'This chrome', value: 'http://autotester'},
    {text: 'http://localhost:4444/wd/hub', value: 'http://localhost:4444/wd/hub'},
    {text: 'http://ondemand.saucelabs.com:80/wd/hub', value: 'http://ondemand.saucelabs.com:80/wd/hub'},
  ];
  items.forEach(item => {
    const option = new Option(item.text, item.value, false);
    return el.options[el.options.length] = option;
  });
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
