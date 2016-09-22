/**
 * Tests run controller
 */

const thenChrome = require('then-chrome');
const mobx = require('mobx');
const path = require('path');
const store = require('../store').store;
const {APP_STATE, TAB} = require('../store/constants');
const bgApi = require('./bg-api');
const {onTestsRun, onTestsDone} = require('./internal-channels');

exports.init = function () {
  onTestsRun.addListener(mobx.action(run));
  onTestsDone.addListener(mobx.action(done));
};

/**
 * Run
 */
function run() {
  // sharedConsole.clear();
  // window.report.innerHTML = '';

  store.appState = APP_STATE.TESTS_RUNNING;
  store.selectedTab = TAB.REPORT;

  const data = prepareData();
  bgApi.runTests(data);
}

function prepareData() {
  const data = {
    targetId: store.selectedTarget,
    noQuit: store.noQuit,
  };

  setTarget(data);
  if (store.isSnippets()) {
    setSnippets(data);
  } else {
    setFiles(data);
  }

  return data;
}

function setSnippets(data) {
  data.snippets = store.snippets
    .filter(snippet => !store.selectedSnippet || snippet.id === store.selectedSnippet)
    .map(snippet => {
    return {
      path: formatSnippetName(snippet.name),
      code: snippet.code,
    };
  });
}

function setFiles(data) {
  data.baseUrl = path.dirname(store.testsSourceUrl);
  data.files = store.testsSetup.slice();
  if (store.selectedTest) {
    const test = store.tests.find(t => t === store.selectedTest);
    data.files.push(test);
  } else {
    data.files = data.files.concat(store.tests.slice());
  }
}

function setTarget(data) {
  const target = store.targets[store.selectedTarget];
  if (!target) {
    throw new Error('Empty target');
  }
  const hub = store.hubs.find(h => h.id === target.hubId);
  data.target = {
    serverUrl: hub.serverUrl,
    watchUrl: hub.watchUrl,
    loopback: hub.loopback,
    name: target.name,
    caps: Object.assign({}, hub.caps, target.caps),
  };
}

function done() {
  store.appState = APP_STATE.TESTS_DONE;
  // activate self tab after tests done
  activateSelfTab();
}

function activateSelfTab() {
  return thenChrome.tabs.getCurrent()
    .then(tab => thenChrome.tabs.update(tab.id, {active: true}));
}

function formatSnippetName(name) {
  return name.replace(/[ \/]/g, '_');
}
