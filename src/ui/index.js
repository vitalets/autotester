
const messaging = require('../background/messaging');

document.getElementById('run').addEventListener('click', runTests);

messaging.start();

messaging.on(messaging.names.LOAD_TESTS_CONFIG_DONE, config => {
  fillTestList(config);
});

loadConfig();

function runTests() {
  const test = document.getElementById('testlist').value;
  messaging.send(messaging.names.RUN_TESTS, {test});
}

function loadConfig() {
  messaging.send(messaging.names.LOAD_TESTS_CONFIG);
}

function activateSelfTab() {
  return thenChrome.tabs.getCurrent()
    .then(tab => thenChrome.tabs.update(tab.id, {active: true}));
}

function fillTestList(config) {
  const el = document.getElementById('testlist');
  el.options.length = 0;
  el.options[el.options.length] = new Option('All', '');
  config.tests.forEach(test => el.options[el.options.length] = new Option(test, test));
}
