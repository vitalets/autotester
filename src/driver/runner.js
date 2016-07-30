/**
 * Test runner
 * Loads tests from urls and run via mocha
 */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const By = require('selenium-webdriver/lib/by').By;
const until = require('selenium-webdriver/lib/until');
const Key = require('selenium-webdriver/lib/input').Key;
const seleniumAssert = require('selenium-webdriver/testing/assert');

const test = require('./selenium-testing');
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

function setupMocha() {
  window.mocha.setup({
    ui: 'bdd',
    timeout: TIMEOUT_MS,
  });
  test.wrapGlobals(window);
}

function setGlobals() {
  window.test = test;
  window.assert = chai.assert;
  window.By = By;
  window.Key = Key;
  window.until = until;
  window.driver = new Driver();
}

function setGlobalsForOwnSeleniumTests() {
  test.suite = suite;
  const fileserverUrl = 'http://127.0.0.1:2310/common/';
  test.Pages = {
    formPage: fileserverUrl + 'formPage.html'
  };
  window.require = fakeRequire;
}

function prepare() {
  return Promise.resolve()
    // can not run mocha twice, so re-load script every time
    // see https://github.com/mochajs/mocha/issues/995
    .then(() => utils.loadScript('/mocha/mocha.js'))
    .then(() => setupMocha())
    //.then(() => setGlobals())
    .then(() => setGlobalsForOwnSeleniumTests());
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

// === below is for running own selenium tests from 'selenium-webdriver/test'

/**
 * Allows selenium node require
 *
 */
function fakeRequire(moduleName) {
  switch (moduleName) {
    case '..':
      return {By, Key, until};
    case '../testing/assert':
      return seleniumAssert;
    case '../lib/test':
      return test;
    default:
      throw new Error(`Unknown module in fakeRequire: ${moduleName}`);
  }
}

function suite(fn, opt_options) {
  const browser = 'chrome';
  test.describe('[' + browser + ']', function() {
    fn(new TestEnvironment(browser));
  });
}

function TestEnvironment(browserName, server) {
  this.currentBrowser = function() {
    return browserName;
  };

  this.isRemote = function() {
    return false;
  };

  this.browsers = function(var_args) {
    var browsersToIgnore = Array.prototype.slice.apply(arguments, [0]);
    return browsers(browserName, browsersToIgnore);
  };

  this.builder = function() {
    return {
      build: function() {
        return new Driver();
      }
    };
  };
}

/**
 * Creates a predicate function that ignores tests for specific browsers.
 * @param {string} currentBrowser The name of the current browser.
 * @param {!Array.<!Browser>} browsersToIgnore The browsers to ignore.
 * @return {function(): boolean} The predicate function.
 */
function browsers(currentBrowser, browsersToIgnore) {
  return function() {
    return browsersToIgnore.indexOf(currentBrowser) != -1;
  };
}
