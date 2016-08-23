/**
 * Main App controller
 */

const utils = require('../utils');
const evaluate = require('../utils/evaluate');
const messaging = require('./messaging');
const runner = require('../runner');
const storage = require('./storage');

const {
  BG_LOAD_DONE,
  LOAD_TESTS_CONFIG,
  RUN_TESTS,
  RUN_TESTS_DONE,
  SELECT_TEST,
  LOAD_TESTS_CONFIG_DONE,
  RUN_TESTS_STARTED,
} = messaging.names;

class App {
  constructor() {
    this._testsConfig = null;
  }

  start() {
    messaging.start();
    this._setListeners();
    messaging.send(BG_LOAD_DONE);
  }

  _setListeners() {
    messaging.on(LOAD_TESTS_CONFIG, () => this._loadConfig());
    messaging.on(RUN_TESTS, data => this._runTests(data));
    messaging.on(SELECT_TEST, data => this._selectTest(data));
  }

  _loadConfig() {
    const url = addBaseUrl('index.js');
    return utils.fetchText(url)
      .then(text => {
        const config = evaluate.asCommonJs(text);
        this._verifyConfig(config);
        config.url = url;
        this._testsConfig = config;
        this._updateSelectedTest();
        messaging.send(LOAD_TESTS_CONFIG_DONE, {
          config: config,
          selectedTest: storage.get('selectedTest'),
        });
      });
  }

  /**
   * Run tests
   *
   * @param {Object} data
   * @param {String} data.selectedTest
   * @param {Array<{code, path}>} [data.files] special case to run custom files from ui window.runTests
   */
  _runTests(data) {
    const runnerOptions = {
      window: getUiWindow(),
    };
    let runnerPromise;
    if (data.files) {
      runnerPromise = runner.runFiles(data.files, runnerOptions);
    } else {
      const tests = this._testsConfig.tests.filter(test => !data.selectedTest || test === data.selectedTest);
      const setup = this._testsConfig.setup;
      const urls = setup.concat(tests).map(addBaseUrl);
      runnerPromise = runner.runUrls(urls, runnerOptions);
    }
    messaging.send(RUN_TESTS_STARTED);
    runnerPromise
      .then(() => {
        messaging.send(RUN_TESTS_DONE)
      })
      .catch(e => {
        messaging.send(RUN_TESTS_DONE);
        throw e;
      });
  }

  _updateSelectedTest() {
    const selectedTest = storage.get('selectedTest');
    if (selectedTest) {
      const exists = this._testsConfig.tests.some(test => test === selectedTest);
      if (!exists) {
        this._selectTest({name: ''});
      }
    }
  }

  _verifyConfig(config) {
    if (!config) {
      throw new Error('Config is empty');
    }
    if (!Array.isArray(config.setup)) {
      config.setup = [];
    }
    if (!Array.isArray(config.tests)) {
      config.tests = [];
    }
  }

  _selectTest(data) {
    storage.set('selectedTest', data.name);
  }
}

function getUiWindow() {
  const views = chrome.extension.getViews({type: 'tab'});
  if (views.length) {
    return views[0];
  } else {
    throw new Error('Autotester tab not found!');
  }
}

function addBaseUrl(path) {
  const baseUrl = utils.trimSlashes(storage.get('baseUrl'));
  path = utils.trimSlashes(path);
  return `${baseUrl}/${path}`;
}

module.exports = App;
