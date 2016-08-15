/**
 * Test runner
 * Loads tests from urls and run via mocha
 */

const seleniumAssert = require('selenium-webdriver/testing/assert');
const webdriver = require('./selenium-webdriver');
const seleniumTesting = require('./selenium-testing');
const utils = require('../utils');
const evaluate = require('../utils/evaluate');
const Driver = require('../driver');
const fakeRequire = require('./fake-require');
const htmlReporter = require('../reporter/html');
const logger = require('../utils/logger').create('Runner');

/**
 * As functional tests are slow, increase mocha timeout
 */
const TIMEOUT_MS = 30 * 1000;

/**
 * Run tests
 *
 * @param {Object} params
 * @param {Array} params.urls
 * @param {Object} params.window
 * @param {Number} [params.timeout]
 * @returns {Promise}
 */
exports.run = function (params) {
  return Promise.resolve()
    .then(() => setupMocha(params))
    .then(() => fetchCode(params.urls))
    .then(code => runCode(code, params.window))
    .then(() => tryRunMocha())
};

function setupMocha(params) {
  return Promise.resolve()
    // can not run mocha twice, so re-load script every time
    // see https://github.com/mochajs/mocha/issues/995
    // todo: maybe use Mocha constructor
    .then(() => utils.loadScript('/mocha/mocha.js'))
    .then(() => {
      window.mocha.setup({
        ui: 'bdd',
        timeout: params.timeout || TIMEOUT_MS,
        reporter: htmlReporter.getReporter(params.window),
      });
      seleniumTesting.wrapMochaGlobals(window);
    });
}

function fetchCode(urls) {
  return urls ? utils.fetchTextFromUrls(urls) : [];
}

function runCode(code, win) {
  const args = getRunGlobals(win);
  return code.reduce((res, item) => {
    return res.then(() => evaluate.asFunction(item.text, args));
  }, Promise.resolve());
}

/**
 * All this variables are available in tests
 * @param {Object} win
 */
function getRunGlobals(win) {
  return {
    runContext: {},
    Driver: Driver,
    By: webdriver.By,
    Key: webdriver.Key,
    until: webdriver.until,
    // for running tests
    test: seleniumTesting,
    assert: seleniumAssert,
    // for running selenium tests as is
    require: fakeRequire,
    // for debugging
    console: win.console,
  };
}

function tryRunMocha() {
  const hasSuites = window.mocha.suite.suites.length;
  const hasTests = window.mocha.suite.tests.length;
  if (hasSuites || hasTests) {
    logger.log('Running mocha');
    return new Promise(resolve => {
      const runner = window.mocha.run(resolve);
      catchErrorsInsideMocha(runner);
    })
    .then(failures => logger.log(`Finalize mocha with ${failures} failure(s)`));
  }
}

function catchErrorsInsideMocha(runner) {
  // mocha encapsulate errors inside, so catch err via 'fail' event and re-throw to see pretty console message
  // excluding AssertionError
  runner.on('fail', function (test) {
    if (test.err.name !== 'AssertionError') {
      setTimeout(() => {
        throw test.err;
      }, 0);
    }
  });
}
