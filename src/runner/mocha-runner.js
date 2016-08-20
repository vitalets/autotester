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
  timeout: 3 * 1000,
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

module.exports = MochaRunner;

/**
 *
 * @param {Object} params
 * @param {Object} params.context
 * @param {Object} params.reporter
 * @param {Object} params.timeout
 */
exports.setup = function (params) {
  return Promise.resolve()
    // can not run mocha twice, so re-eval it every time in new runContext
    // see https://github.com/mochajs/mocha/issues/995
    // see https://github.com/mochajs/mocha/issues/1938
    //.then(() => utils.loadScript(MOCHA_URL))
    .then(() => evalualeMochaCode({vit: 1}))
    .then(() => {
      window.mocha.setup({
        ui: 'bdd',
        timeout: params.timeout || TIMEOUT_MS,
        reporter: htmlReporter.getReporter(params.window),
      });
      seleniumTesting.wrapMochaGlobals(window);
    });
};

exports.hasTests = function () {
  const suitesCount = window.mocha.suite.suites.length;
  const testsCount = window.mocha.suite.tests.length;
  return suitesCount || testsCount;
};

exports.run = function () {
  logger.log(`Running mocha...`);
  return new Promise(resolve => {
    const runner = window.mocha.run(resolve);
    catchErrorsInsideMocha(runner);
  })
  .then(failures => logger.log(`Mocha finished with ${failures} failure(s)`));
};

function evalualeMochaCode(context) {
  console.log(mocha);

  // mocha.setup({
  //     ui: 'bdd',
  // });
  // evaluate.asFunction(mochaCode, {global: context});
  // context.mocha.setup({
  //   ui: 'bdd',
  // });

  // const m = new context.Mocha({
  //   ui: 'bdd',
  // });
  // console.log('mocha', context, m);
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
