/**
 * Mocha runner
 */

const utils = require('../utils');
const logger = require('../utils/logger').create('Mocha-runner');

const MOCHA_PATH = 'core/background/mocha.js';
const DEFAULT_OPTIONS = {
  ui: 'bdd',
  timeout: 30 * 1000,
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
  load(context = window) {
    this._context = context;
    return Promise.resolve()
      .then(() => this._context.loadScript(MOCHA_PATH))
      .then(() => this._getMocha().setup(this._mochaOptions))
      .then(() => logger.log('Mocha loaded'));
    // this._storeFilenames();
  }

  hasTests() {
    const suite = this._getMocha().suite;
    return suite.suites.length || suite.tests.length;
  }

  run() {
    const suitesCount = this._getMocha().suite.suites.length;
    logger.log(`Run mocha for ${suitesCount} suite(s)`);
    return new Promise(resolve => {
        const runner = this._getMocha().run(resolve);
        // catchErrorsInsideMocha(runner);
      })
      .then(failures => logger.log(`Finish mocha with ${failures} failure(s)`));
  }

  _getMocha() {
    return this._context.window.mocha;
  }

  _storeFilenames() {
    // store current filename to custom field of suite
    // for readable error messages later
    this._getMocha().suite.on('suite', suite => {
      suite.filename = this._context.__filename;
    });
  }
}

function catchErrorsInsideMocha(runner) {
  // mocha encapsulate errors inside, so catch err via 'fail' event
  // and re-throw to see pretty console message
  // excluding AssertionError
  runner.on('fail', function (test) {
    if (test.err.name !== 'AssertionError') {
      // mark error with flag to not show it in htmlConsole
      // (as mocha reporter shows errors itself)
      test.err.isMocha = true;
      // throw error out to see pretty stack trace in background console
      // use asyncThrow to go out of promise chain
      utils.asyncThrow(test.err);
    }
  });
}

module.exports = MochaRunner;
