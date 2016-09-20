/**
 * Tests run controller
 */

const thenChrome = require('then-chrome');
const mobx = require('mobx');
const store = require('../store').store;
const {APP_STATE, TAB} = require('../store/constants');
const bgApi = require('./bg-api');
const {onTestsRun, onTestsDone} = require('./internal-events');

exports.init = function () {
  onTestsRun.addListener(mobx.action(run));
  onTestsDone.addListener(mobx.action(done));
};

/**
 * Run
 */
function run() {
  // if (files && !Array.isArray(files)) {
  //   throw new Error('files should be array');
  // }
  // sharedConsole.clear();
  // window.report.innerHTML = '';

  store.appState = APP_STATE.TESTS_RUNNING;
  store.selectedTab = TAB.REPORT;
  const data = {
    tests: store.tests,
    selectedTest: store.selectedTest,
    targetId: store.selectedTarget,
    noQuit: store.noQuit,
  };
  bgApi.runTests(data);
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
