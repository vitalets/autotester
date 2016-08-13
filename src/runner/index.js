/**
 * Test runner
 * Loads tests from urls and run via mocha
 */

const seleniumAssert = require('selenium-webdriver/testing/assert');
const webdriver = require('./selenium-webdriver');
const test = require('./selenium-testing');
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
    .then(() => setupMocha({
      reporter: htmlReporter.getReporter(params.window),
      timeout: params.timeout,
    }))
    .then(() => setGlobals())
    .then(() => fetchCode(params.urls))
    .then(code => runCode(code, params.window))
    //.then(() => tryRunMocha())
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
        reporter: params.reporter,
      });
      test.wrapMochaGlobals(window);
    });
}

function setGlobals() {
  window.test = test;
  window.assert = seleniumAssert;
  window.By = webdriver.By;
  window.Key = webdriver.Key;
  window.until = webdriver.until;
  window.require = fakeRequire;
  window.Driver = Driver;
}

function fetchCode(urls) {
  return urls ? utils.fetchTextFromUrls(urls) : [];
}

function runCode(code, win) {
  const args = {
    runContext: {},
    console: win.console,
  };
  return code.reduce((res, item) => {
    return res.then(() => evaluate.asFunction(item.text, args));
  }, Promise.resolve());
}

function loadSeries(urls) {
  return (urls || []).reduce((res, url) => {
    return res
      .then(() => utils.fetchText(url))
      .then(code => evaluate.asAnonymousFn(code));
  }, Promise.resolve());
}

function tryRunMocha() {
  if (window.mocha.tests.length) {
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
