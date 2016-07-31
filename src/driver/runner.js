/**
 * Test runner
 * Loads tests from urls and run via mocha
 */

// const chai = require('chai');
// const chaiAsPromised = require('chai-as-promised');
// chai.use(chaiAsPromised);

const By = require('selenium-webdriver/lib/by').By;
const until = require('selenium-webdriver/lib/until');
const Key = require('selenium-webdriver/lib/input').Key;
const assert = require('selenium-webdriver/testing/assert');

const test = require('./selenium-testing');
const utils = require('./utils');
const Driver = require('./driver');
const logger = require('./logger').create('Runner');

/**
 * As functional tests are slow, increase mocha timeout
 */
const TIMEOUT_MS = 30 * 1000;

/**
 * Run tests
 *
 * @param {Array} testUrls
 * @param {Array} [prepareUrls]
 * @returns {Promise}
 */
exports.run = function (testUrls, prepareUrls) {
  return Promise.resolve()
    .then(() => setup())
    .then(() => loadPrepare(prepareUrls))
    .then(() => loadTests(testUrls))
    .then(() => run())
    .then(failures => finalize(failures))
};

function setupMocha() {
  window.mocha.setup({
    ui: 'bdd',
    timeout: TIMEOUT_MS,
  });
  test.wrapGlobals(window);
}

function setGlobals() {
  window.test = test;
  window.assert = assert;
  window.By = By;
  window.Key = Key;
  window.until = until;
  window.require = fakeRequire;
  window.driver = new Driver();
}

function setup() {
  return Promise.resolve()
    // can not run mocha twice, so re-load script every time
    // see https://github.com/mochajs/mocha/issues/995
    // todo: maybe use Mocha constructor
    .then(() => utils.loadScript('/mocha/mocha.js'))
    .then(() => setupMocha())
    .then(() => setGlobals());
    //.then(() => setGlobalsForOwnSeleniumTests());
}

function loadPrepare(urls) {
  return (urls || []).reduce((res, url) => {
    return res.then(() => utils.loadScript(url));
  }, Promise.resolve());
}

function loadTests(urls) {
  //testIndex = parseInt(testIndex, 10);
  //const urls = Number.isNaN(testIndex) ? this.parsedTests.urls : this.parsedTests.objects[testIndex].urls;
  //console.log(`Running ${urls.length} test file(s)`);
  const tasks = urls
    .map(url => utils.loadScript(url));
  return Promise.all(tasks);
}

function run() {
  logger.log('Running');
  return new Promise(resolve => window.mocha.run(resolve));
}

function finalize(failures) {
  logger.log(`Finalize with ${failures} failure(s)`);
}

/**
 * Allows to require selenium stuff in autotester tests.
 * In fact it is proxy to globals.
 */
function fakeRequire(moduleName) {
  switch (moduleName) {
    case 'selenium-webdriver':
      return {By, Key, until};
    case 'selenium-webdriver/testing/assert':
      return window.assert;
    case 'selenium-webdriver/lib/test':
      return window.test;
    default:
      throw new Error(`Unsupported module in fakeRequire: ${moduleName}`);
  }
}
