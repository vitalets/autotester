/**
 * Mocha runner
 */

const Channel = require('chnl');
const htmlReporter = require('./reporters/html');
const utils = require('../../../utils');
const logger = require('../../../utils/logger').create('Mocha-runner');

const MOCHA_PATH = 'core/background/mocha.js';
const DEFAULT_OPTIONS = {
  ui: 'bdd',
  timeout: 30 * 1000,
  bail: false,
  reporter: null,
  // allowUncaught: true, // i did not managed to get it working
};

class MochaRunner {
  /**
   * Constructor
   *
   * @param {Object} options
   * @param {Boolean} options.bail
   * @param {Number} options.timeout
   * @param {Object} options.uiWindow
   */
  constructor(options) {
    this._mochaOptions = Object.assign({}, DEFAULT_OPTIONS, {
      timeout: options.timeout,
      bail: options.bail,
      reporter: htmlReporter.getReporter(options.uiWindow)
    });
    this.onTestStarted = new Channel();
  }

  /**
   * Load mocha in specified context
   *
   * @param {Object} context
   */
  loadTo(context) {
    this._context = context;
    this._cleanUp();
    return Promise.resolve()
      .then(() => this._load())
      .then(() => {
        this._getMocha().setup(this._mochaOptions);
        logger.log('Mocha loaded and ready');
      })
  }

  tryRun() {
    return this._hasTests() ? this._run() : Promise.resolve();
  }

  _hasTests() {
    const suite = this._getMocha().suite;
    return suite.suites.length || suite.tests.length;
  }

  _run() {
    const suitesCount = this._getMocha().suite.suites.length;
    logger.log(`Run mocha for ${suitesCount} suite(s)`);
    return new Promise(resolve => {
        this._runner = this._getMocha().run(resolve);
        this._setRunnerListeners();
      })
      .then(failures => logger.log(`Finish mocha with ${failures} failure(s)`));
  }

  _load() {
    return utils.loadScript(MOCHA_PATH, this._context.document)
  }

  _getMocha() {
    return this._context.mocha;
  }

  _cleanUp() {
    this._testIndex = 0;
    utils.removeBySelector(`script[src="${MOCHA_PATH}"]`, this._context.document);
  }

  _setRunnerListeners() {
    // to see pretty error messages in background console, proxy non-assertion errors from mocha
    this._runner.on('fail', test => this._proxyError(test));
    this._runner.on('test', test => this._dispatchTestStart(test));
  }

  _proxyError(test) {
    const err = test.err;
    if (err && err.name !== 'AssertionError') {
      // mark error with flag to not show it in htmlConsole
      // (as mocha reporter shows errors itself)
      err.isMocha = true;
      // use asyncThrow to go out of promise chain but show correct stack in bg console
      utils.asyncThrow(err);
    }
  }

  _dispatchTestStart(test) {
    this._testIndex++;
    this.onTestStarted.dispatch({index: this._testIndex, title: test.fullTitle()});
  }
}

module.exports = MochaRunner;
