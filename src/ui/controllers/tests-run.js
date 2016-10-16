/**
 * Tests run controller
 */

const thenChrome = require('then-chrome');
const mobx = require('mobx');
const path = require('path');
const state = require('../state');
const {APP_STATE, TAB} = require('../state/constants');
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
    stopOnError: false,
    target: getTarget(0),
    snippets: snippets,
  };
  run(data);
};

const run = mobx.action(function (data) {
  state.appState = APP_STATE.TESTS_RUNNING;
  state.selectedTab = TAB.REPORT;
  onConsoleClear.dispatch();
  bgApi.runTests(data);
});

const done = mobx.action(function () {
  state.appState = APP_STATE.TESTS_DONE;
  // activate self tab after tests done
  activateSelfTab();
});

function runOnCurrentData() {
  const data = getData();
  run(data);
}

function getData() {
  const data = {
    stopOnError: state.stopOnError,
    target: getTarget(state.selectedTarget),
  };

  if (state.isSnippets()) {
    data.snippets = getSnippets();
  } else {
    const {files, baseUrl} = getFiles();
    data.baseUrl = baseUrl;
    data.files = files;
  }

  return data;
}

function getSnippets() {
  return state.snippets
    .filter(snippet => !state.selectedSnippet || snippet.id === state.selectedSnippet)
    .map(snippet => {
    return {
      path: formatSnippetName(snippet.name),
      code: snippet.code,
    };
  });
}

function getFiles() {
  const baseUrl = path.dirname(state.getTestsUrl());
  const files = state.testsSetup.slice();
  if (state.selectedTest) {
    const test = state.tests.find(t => t === state.selectedTest);
    files.push(test);
  } else {
    state.tests.forEach(test => files.push(test));
  }
  return {baseUrl, files};
}

function getTarget(targetIndex) {
  const target = state.targets[targetIndex];
  if (!target) {
    throw new Error('Empty target');
  }
  const hub = state.hubs.find(h => h.id === target.hubId);
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
