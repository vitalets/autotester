/**
 * Mocha runner
 */

const utils = require('../utils');
const seleniumTesting = require('./selenium-testing');
const mochaCode = require('raw!mocha/mocha.js');
const evaluate = require('../utils/evaluate');
const logger = require('../utils/logger').create('Mocha-runner');

const DEFAULT_OPTIONS = {
  ui: 'bdd',
  timeout: 30 * 1000,
};

class MochaRunner {
  /**
   * Constructor
   *
   * @param {Object} context where to load mocha
   */
  constructor(context) {
    this._context = context;
    evaluate.asFunction(mochaCode, {global: this._context});
  }

  /**
   * Setup mocha instance
   *
   * @param {Object} [options]
   * @param {Object} [options.ui]
   * @param {Object} [options.reporter]
   * @param {Object} [options.timeout]
   */
  setup(options) {
    options = Object.assign({}, DEFAULT_OPTIONS, utils.noUndefined(options));
    this._context.mocha.setup(options);
    this._storeFilenames();
    seleniumTesting.wrapMochaGlobals(this._context);
  }

  hasTests() {
    const suite = this._context.mocha.suite;
    return suite.suites.length || suite.tests.length;
  }

  run() {
    const suitesCount = this._context.mocha.suite.suites.length;
    logger.log(`Run mocha for ${suitesCount} suite(s)`);
    return new Promise(resolve => {
        const runner = this._context.mocha.run(resolve);
        catchErrorsInsideMocha(runner);
      })
      .then(failures => logger.log(`Finish mocha with ${failures} failure(s)`));
  }

  _storeFilenames() {
    // store current filename to custom field of suite
    // for readable error messages later
    this._context.mocha.suite.on('suite', suite => {
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
