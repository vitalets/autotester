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

  start() {
    messaging.start();
    this._setListeners();
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
        this._verifyConfig(config);
        config.url = url;
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
    //todo: rename to selectedTest
    const tests = this._testsConfig.tests.filter(test => !data.test || test === data.test);
    const setup = this._testsConfig.setup;
    const urls = setup.concat(tests).map(addBaseUrl);
    const runnerOptions = {
      window: getReporterWindow(),
    };
    messaging.send(messaging.names.RUN_TESTS_STARTED);
    runner.runUrls(urls, runnerOptions)
      .then(() => {
        messaging.send(messaging.names.RUN_TESTS_DONE, {})
      })
      .catch(e => {
        messaging.send(messaging.names.RUN_TESTS_DONE, {});
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

function getReporterWindow() {
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
