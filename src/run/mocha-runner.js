/**
 * Mocha runner
 */

const utils = require('../utils');
const seleniumTesting = require('./selenium-testing');
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
   * @param {Object} options
   * @param {Object} options.reporter
   */
  constructor(options) {
    this._mochaOptions = Object.assign({}, DEFAULT_OPTIONS, {reporter: options.reporter});
  }

  /**
   * Load mocha in specified context
   *
   * @param {Object} context
   */
  setup(context) {
    this._context = context;
    this._remove();
    return Promise.resolve()
      .then(() => this._load())
      .then(() => {
        this._getMocha().setup(this._mochaOptions);
        seleniumTesting.wrapMochaGlobals(this._context);
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
        const runner = this._getMocha().run(resolve);
        proxyNonAssertionErrors(runner);
      })
      .then(failures => logger.log(`Finish mocha with ${failures} failure(s)`));
  }

  _load() {
    return utils.loadScript(MOCHA_PATH, this._context.document)
  }

  _getMocha() {
    return this._context.mocha;
  }

  _remove() {
    utils.removeBySelector(`script[src="${MOCHA_PATH}"]`, this._context.document);
  }
}

function proxyNonAssertionErrors(runner) {
  // to see pretty error messages in background console, proxy non-assertion errors from mocha
  runner.on('fail', function (test) {
    if (test.err.name !== 'AssertionError') {
      // mark error with flag to not show it in htmlConsole
      // (as mocha reporter shows errors itself)
      test.err.isMocha = true;
      // use asyncThrow to go out of promise chain
      utils.asyncThrow(test.err);
    }
  });
}

module.exports = MochaRunner;
