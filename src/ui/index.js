
const thenChrome = require('then-chrome');
const messaging = require('../background/messaging');
const title = require('./title');
const HtmlConsole = require('./html-console');
const shareCalls = require('../utils/share-calls');

window.htmlConsole = new HtmlConsole('#console');
window.sharedConsole = shareCalls(console, htmlConsole);

document.getElementById('run').addEventListener('click', runTests);
document.getElementById('testlist').addEventListener('change', onTestSelected);

title.setListeners();

messaging.start();

messaging.on(messaging.names.LOAD_TESTS_CONFIG_DONE, fillTestList);
messaging.on(messaging.names.RUN_TESTS_DONE, onDone);

loadConfig();

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
