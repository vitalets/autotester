/**
 * Main App controller
 */

const utils = require('../utils');
const evaluate = require('../utils/evaluate');
const messaging = require('./messaging');
const runner = require('../runner');
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
    messaging.on(messaging.names.SELECT_TEST, data => this._selectTest(data));
  }

  _loadConfig() {
    const url = addBaseUrl('index.js');
    return utils.fetchText(url)
      .then(text => {
        const config = evaluate.asCommonJs(text);
        this._testsConfig = config;
        this._updateSelectedTest();
        messaging.send(messaging.names.LOAD_TESTS_CONFIG_DONE, {
          config: config,
          selectedTest: storage.get('selectedTest'),
        });
      });
  }

  /**
   * Run tests
   *
   * @param {Object} data
   * @param {String} data.test
   */
  _runTests(data) {
    const tests = data.test //todo: rename to selectedTest
      ? this._testsConfig.tests.filter(test => test === data.test)
      : this._testsConfig.tests;
    const runnerParams = {
      urls: addBaseUrlToArr(tests),
      //before: addBaseUrlToArr(this._testsConfig.before),
      // after: addBaseUrlToArr(this._testsConfig.after),
      window: getReporterWindow(),
    };
    messaging.send(messaging.names.RUN_TESTS_STARTED);
    runner.run(runnerParams)
      .then(() => messaging.send(messaging.names.RUN_TESTS_DONE));
  }

  _updateSelectedTest() {
    const selectedTest = storage.get('selectedTest');
    if (selectedTest && Array.isArray(this._testsConfig.tests)) {
      const exists = this._testsConfig.tests.some(test => test === selectedTest);
      if (!exists) {
        this._selectTest({name: ''});
      }
    }
  }

  _selectTest(data) {
    storage.set('selectedTest', data.name);
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
