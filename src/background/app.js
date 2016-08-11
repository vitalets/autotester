/**
 * Main App controller
 */

const utils = require('../driver/utils');
const messaging = require('./messaging');
const runner = require('../driver/runner');
const htmlReporter = require('../reporter/html');
const storage = require('./storage');

class App {
  constructor() {
    this._testsConfig = null;
  }

  run() {
    messaging.start();
    this._setListeners();
    this._loadConfig();
  }

  _setListeners() {
    messaging.on(messaging.names.LOAD_TESTS_CONFIG, () => this._loadConfig());
    messaging.on(messaging.names.RUN_TESTS, data => this._runTests(data));
  }

  _loadConfig() {
    const url = addBaseUrl('index.js');
    return utils.fetchCommonJsScript(url)
      .then(config => {
        this._testsConfig = config;
        messaging.send(messaging.names.LOAD_TESTS_CONFIG_DONE, config);
      });
  }

  /**
   * Run tests
   *
   * @param {Object} data
   * @param {String} data.test
   */
  _runTests(data) {
    const tests = data.test
      ? this._testsConfig.tests.filter(test => test === data.test)
      : this._testsConfig.tests;
    const runnerParams = {
      tests: addBaseUrlToArr(tests),
      before: addBaseUrlToArr(this._testsConfig.before),
      after: addBaseUrlToArr(this._testsConfig.after),
      reporter: getReporter(),
    };
    runner.run(runnerParams);
  }
}

function getReporterWindow() {
  const views = chrome.extension.getViews({type: 'tab'});
  if (views.length) {
    return views[0];
  } else {
    throw new Error('Autotester tab not found!');
  }
}

function getReporter() {
  const reporterWin = getReporterWindow();
  return htmlReporter.getReporter(reporterWin);
}

function addBaseUrl(path) {
  const baseUrl = trimSlashes(storage.get('baseUrl'));
  path = trimSlashes(path);
  return `${baseUrl}/${path}`;
}

// temp!
function addBaseUrlToArr(arr) {
  return (arr || []).map(addBaseUrl);
}

// todo: move to utils
function trimSlashes(str) {
  return str.replace(/^\/+|\/+$/g, '');
}

module.exports = App;
