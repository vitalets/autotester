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
    seleniumTesting.wrapMochaGlobals(this._context);
  }

  hasTests() {
    const suite = this._context.mocha.suite;
    return suite.suites.length || suite.tests.length;
  }

  run() {
    logger.log(`Running mocha`);
    return new Promise(resolve => {
        const runner = this._context.mocha.run(resolve);
        catchErrorsInsideMocha(runner);
      })
      .then(failures => logger.log(`Mocha finished with ${failures} failure(s)`));
  }
}

function catchErrorsInsideMocha(runner) {
  // mocha encapsulate errors inside, so catch err via 'fail' event
  // and re-throw to see pretty console message
  // excluding AssertionError
  runner.on('fail', function (test) {
    if (test.err.name !== 'AssertionError') {
      // mark error to not show in htmlConsole as mocha shows it normally
      test.err.isMocha = true;
      // throw error asynchronously to go out of promise chain
      utils.asyncThrow(test.err);
    }
  });
}

module.exports = MochaRunner;
