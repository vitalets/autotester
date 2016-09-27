/**
 * Tests run controller
 */

const thenChrome = require('then-chrome');
const mobx = require('mobx');
const path = require('path');
const store = require('../store').store;
const {APP_STATE, TAB} = require('../store/constants');
const bgApi = require('./bg-api');
const {onTestsRun, onTestsDone, onConsoleClear} = require('./internal-channels');

exports.init = function () {
  onTestsRun.addListener(runOnCurrentData);
  onTestsDone.addListener(done);
};

/**
 * Run custom snippets
 *
 * @param {Array<{path, code}>} snippets
 */
exports.runCustomSnippets = function(snippets) {
  const data = {
    noQuit: false,
    target: getTarget(0),
    snippets: snippets,
  };
  run(data);
};

const run = mobx.action(function (data) {
  store.appState = APP_STATE.TESTS_RUNNING;
  store.selectedTab = TAB.REPORT;
  onConsoleClear.dispatch();
  bgApi.runTests(data);
});

const done = mobx.action(function () {
  store.appState = APP_STATE.TESTS_DONE;
  // activate self tab after tests done
  activateSelfTab();
});

function runOnCurrentData() {
  const data = getData();
  run(data);
}

function getData() {
  const data = {
    noQuit: store.noQuit,
    target: getTarget(store.selectedTarget),
  };

  if (store.isSnippets()) {
    data.snippets = getSnippets();
  } else {
    const {files, baseUrl} = getFiles();
    data.baseUrl = baseUrl;
    data.files = files;
  }

  return data;
}

function getSnippets() {
  return store.snippets
    .filter(snippet => !store.selectedSnippet || snippet.id === store.selectedSnippet)
    .map(snippet => {
    return {
      path: formatSnippetName(snippet.name),
      code: snippet.code,
    };
  });
}

function getFiles() {
  const baseUrl = path.dirname(store.getTestsUrl());
  const files = store.testsSetup.slice();
  if (store.selectedTest) {
    const test = store.tests.find(t => t === store.selectedTest);
    files.push(test);
  } else {
    store.tests.forEach(test => files.push(test));
  }
  return {baseUrl, files};
}

function getTarget(targetIndex) {
  const target = store.targets[targetIndex];
  if (!target) {
    throw new Error('Empty target');
  }
  const hub = store.hubs.find(h => h.id === target.hubId);
  return {
    serverUrl: hub.serverUrl,
    watchUrl: hub.watchUrl,
    loopback: hub.loopback,
    name: target.name,
    caps: Object.assign({}, hub.caps, target.caps),
  };
}

function activateSelfTab() {
  return thenChrome.tabs.getCurrent()
    .then(tab => thenChrome.tabs.update(tab.id, {active: true}));
}

function formatSnippetName(name) {
  return name.replace(/[ \/]/g, '_');
}
