/**
 * Mocha runner
 */

const Channel = require('chnl');
const utils = require('../utils');
const logger = require('../utils/logger').create('Mocha-runner');

const MOCHA_PATH = 'core/background/mocha.js';
const DEFAULT_OPTIONS = {
  ui: 'bdd',
  timeout: 30 * 1000,
  // allowUncaught: true, // i did not managed to get it working
};

class MochaRunner {
  /**
   * Constructor
   *
   * @param {Object} params
   * @param {Object} params.reporter
   */
  constructor(params) {
    this._params = params;
    this._mochaOptions = Object.assign({}, DEFAULT_OPTIONS, {reporter: params.reporter});
    this.onTestStart = new Channel();
  }

  /**
   * Load mocha in specified context
   *
   * @param {Object} context
   */
  setup(context) {
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
    this._runner.on('test', () => this._dispatchTestStart());
  }

  _proxyError(test) {
    const err = test.err;
    if (err && err.name !== 'AssertionError') {
      // mark error with flag to not show it in htmlConsole
      // (as mocha reporter shows errors itself)
      err.isMocha = true;
      // use asyncThrow to go out of promise chain
      utils.asyncThrow(err);
    }
  }

  _dispatchTestStart() {
    this._testIndex++;
    this.onTestStart.dispatch({index: this._testIndex});
  }
}

module.exports = MochaRunner;
