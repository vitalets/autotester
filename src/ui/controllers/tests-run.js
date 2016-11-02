/**
 * Tests run controller
 */

const thenChrome = require('then-chrome');
const mobx = require('mobx');
const path = require('path');
const fs = require('bro-fs');
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
    target: getSelectedTargetInfo(),
    snippets: snippets,
    devMode: false,
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
  const data = {
    target: getSelectedTargetInfo(),
    baseUrl: getBaseUrl(),
    files: getFiles(),
    devMode: state.devMode,
  };
  if (state.isInnerFiles) {
    getSnippets(data.baseUrl, data.files).then(snippets => {
      data.snippets = snippets;
      run(data);
    });
  } else {
    run(data);
  }
}

function getFiles() {
  if (state.selectedFile) {
    return state.files
      .filter(file => file.isSetup)
      .map(file => file.path)
      .concat([state.selectedFile]);
  } else {
    return state.files.map(file => file.path);
  }
}

function getBaseUrl() {
  return state.isInnerFiles ? state.innerFilesPath : path.dirname(state.filesSourceUrl);
}

function getSnippets(basePath, paths) {
  const tasks = paths.map(path => {
    const fullPath = basePath + '/' + path;
    return fs.readFile(fullPath)
      .then(code => {
        return {path, code};
      });
  });
  return Promise.all(tasks);
}

function getSelectedTargetInfo() {
  if (!state.selectedTarget) {
    throw new Error('Empty target');
  }
  const hub = state.hubs.find(hub => hub.id === state.selectedTarget.hubId);
  return {
    serverUrl: hub.serverUrl,
    watchUrl: hub.watchUrl,
    loopback: hub.loopback,
    name: state.selectedTarget.name,
    caps: Object.assign({}, hub.caps, state.selectedTarget.caps),
  };
}

function activateSelfTab() {
  return thenChrome.tabs.getCurrent()
    .then(tab => thenChrome.tabs.update(tab.id, {active: true}));
}
