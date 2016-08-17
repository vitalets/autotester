/**
 * Mocha runner
 */

const utils = require('../utils');
const htmlReporter = require('../reporter/html');
const seleniumTesting = require('./selenium-testing');
const logger = require('../utils/logger').create('Run-mocha');

const MOCHA_URL = '/core/mocha/mocha.js';

/**
 * As functional tests are slow, increase mocha timeout
 */
const TIMEOUT_MS = 30 * 1000;

exports.setup = function (params) {
  return Promise.resolve()
    // can not run mocha twice, so re-load script every time
    // see https://github.com/mochajs/mocha/issues/995
    // todo: maybe use Mocha constructor
    .then(() => utils.loadScript(MOCHA_URL))
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
