/**
 * Test runner
 * Loads tests from urls and run via mocha
 */

const promise = require('selenium-webdriver/lib/promise');
const seleniumTesting = require('./selenium-testing');
const utils = require('../utils');
const evaluate = require('../utils/evaluate');
const htmlReporter = require('../reporter/html');
const globals = require('./globals');
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
    .then(() => fetchFiles(params.urls))
    .then(files => runFiles(files, params.window))
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

function fetchFiles(urls) {
  return urls ? utils.fetchTextFromUrls(urls) : [];
}

function runFiles(files, win) {
  const args = globals.get(win);
  return files.reduce((res, file) => {
    return res.then(() => runFile(file, args));
  }, Promise.resolve());
}

/**
 * Execute file and wait until control flow finish queue
 * @param {Object} file
 * @param {Object} args
 * @returns {Promise}
 * todo: split on smaller fns or create class
 */
function runFile(file, args) {
  return new Promise((resolve, reject) => {
    const {IDLE, UNCAUGHT_EXCEPTION} = promise.ControlFlow.EventType;
    const flow = promise.controlFlow();

    logger.log(`Run ${file.url}`);
    try {
      evaluate.asFunction(file.text, args);
    } catch(e) {
      attachErrorUiMessage(e, file.url);
      flow.reset();
      throw e;
    }

    if (flow.isIdle()) {
      resolve();
      return;
    }

    flow.on(IDLE, () => {
      flow.removeAllListeners();
      resolve();
    });

    flow.on(UNCAUGHT_EXCEPTION, function (e) {
      // try catch needed as we are already in catch and can not throw second error
      // so at least log it to console
      try {
        flow.removeAllListeners();
        attachErrorUiMessage(e, file.url);
      } catch (err) {
        console.error(err);
      }
      reject(e);
    });
  });
}

function attachErrorUiMessage(e, filename) {
  e.uiMessage = evaluate.getErrorMessage(e, filename);
}

function tryRunMocha() {
  const suitesCount = window.mocha.suite.suites.length;
  const testsCount = window.mocha.suite.tests.length;
  if (suitesCount || testsCount) {
    logger.log(`Running mocha for ${suitesCount} suite(s) and ${testsCount} test(s)`);
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
