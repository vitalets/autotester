
const thenChrome = require('then-chrome');
const messaging = require('../background/messaging');
const title = require('./title');

start();

function start() {
  document.getElementById('run').addEventListener('click', runTests);
  document.getElementById('testlist').addEventListener('change', onTestSelected);

  title.setListeners();
  messaging.start();

  messaging.on(messaging.names.LOAD_TESTS_CONFIG_DONE, onConfigLoaded);
  messaging.on(messaging.names.RUN_TESTS_DONE, onDone);

  loadConfig();

  welcome();
}

function runTests() {
  sharedConsole.clear();
  const test = document.getElementById('testlist').value;
  messaging.send(messaging.names.RUN_TESTS, {test});
}

function loadConfig() {
  title.set('loading...');
  messaging.send(messaging.names.LOAD_TESTS_CONFIG);
}

function activateSelfTab() {
  return thenChrome.tabs.getCurrent()
    .then(tab => thenChrome.tabs.update(tab.id, {active: true}));
}

function onConfigLoaded(data) {
  const msg = `Config successfully loaded from: **${data.config.url}**\nTests found: **${data.config.tests.length}**`;
  htmlConsole.info(msg);
  fillTestList(data);
}

function fillTestList(data) {
  const firstItem = {value: '', text: 'All'};
  const testItems = data.config.tests.map(test => {
    return {value: test, text: test};
  });
  const items = [firstItem].concat(testItems);
  const el = document.getElementById('testlist');
  el.options.length = 0;
  items.forEach(item => {
    const option = new Option(item.text, item.value, false, item.value === data.selectedTest);
    return el.options[el.options.length] = option;
  });
}

function onDone(data) {
  if (data.error) {
    console.error(data.error);
  }
  activateSelfTab();
}

function onTestSelected(event) {
  messaging.send(messaging.names.SELECT_TEST, {name: event.target.value});
}

function welcome() {
  const version = chrome.runtime.getManifest().version;
  const msg = [
    `Welcome to **Autotester v${version}**`,
    ` - chrome extension to develop and run functional tests.\n`,
    `Tests are written on Javascript and may be compatible with **Selenium**.\n`,
    `Please see [Selenium Javascript API Reference](http://seleniumhq.github.io/selenium/docs/api/javascript/) `,
    `for details.`,
  ].join('');
  htmlConsole.log(msg);
}
