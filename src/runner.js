/**
 * Test runner
 * Loads tests from urls and run via mocha
 */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const By = require('selenium-webdriver/lib/by').By;
const until = require('selenium-webdriver/lib/until');
const Key = require('selenium-webdriver/lib/input').Key;

const test = require('./testing');
const utils = require('./utils');
const Driver = require('./driver');
const logger = require('./logger').create('Runner');

/**
 * As functional tests are slow, increase timeout
 */
const TIMEOUT_MS = 30 * 1000;

chai.use(chaiAsPromised);

exports.run = function (urls) {
  return Promise.resolve()
    .then(() => prepare())
    .then(() => loadTests(urls))
    .then(() => run())
    .then(failures => finalize(failures))
};

function setGlobals() {
  window.mocha.setup({
    ui: 'bdd',
    timeout: TIMEOUT_MS,
    allowUncaught: true
  });
  test.wrapGlobals(window);
  window.test = test;
  window.assert = chai.assert;
  window.By = By;
  window.Key = Key;
  window.until = until;
  window.driver = new Driver();
}

function prepare() {
  return Promise.resolve()
    // can not run mocha twice, so re-load script every time
    // see https://github.com/mochajs/mocha/issues/995
    .then(() => utils.loadScript('mocha/mocha.js'))
    .then(() => setGlobals());
}

function loadTests(urls) {
  //testIndex = parseInt(testIndex, 10);
  //const urls = Number.isNaN(testIndex) ? this.parsedTests.urls : this.parsedTests.objects[testIndex].urls;
  //console.log(`Running ${urls.length} test file(s)`);
  const tasks = urls
    // .map(url => this._addBaseUrl(url))
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
 * Allows selenium node require
 * not used now
 */
function fakeRequire(moduleName) {
  switch (moduleName) {
    case 'selenium-webdriver':
      return window;
    case 'selenium-webdriver/testing':
      return test;
    default:
      throw new Error(`Unknown module in fakeRequire: ${moduleName}`);
  }
}
