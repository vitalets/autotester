
const thenChrome = require('then-chrome');
const messaging = require('../background/messaging');
const title = require('./title');

start();

function start() {
  document.getElementById('run').addEventListener('click', runTests);
  document.getElementById('testlist').addEventListener('change', onTestSelected);

  openAllLinksInNewTab();

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
  const msg = [
    `Config successfully loaded from: **${data.config.url}**`,
    `Test files found: **${data.config.tests.length}**`,
    ].join('\n');
  htmlConsole.info(msg);
  fillTestList(data);
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
  const msg = [
    `Welcome to **Autotester!**\n`,
    `For convenient testing please enable two [chrome flags](chrome://flags):\n`,
    `*--silent-debugger-extension-api* - to remove annoying bar about using debugger api\n`,
    `*--extensions-on-chrome-urls* - to allow testing other chrome extensions`,
  ].join('');
  htmlConsole.log(msg);
}

function openAllLinksInNewTab() {
  document.body.addEventListener('click', event => {
    if (event.target.tagName === 'A' && event.target.href) {
      event.preventDefault();
      openOrSwitchToUrl(event.target.href);
    }
  });
}

function openOrSwitchToUrl(url) {
  thenChrome.tabs.query({url})
    .then(tabs => {
      return tabs.length
        ? thenChrome.tabs.update(tabs[0].id, {active: true})
        : thenChrome.tabs.create({url});
    })
}
