/**
 * Main runner.
 * There are 3 approaches how to run test files dynamically:
 *
 * 1. RUN VIA EVAL: wrap each file into anonymous function and eval
 * - impossible to debug
 * - ugly error stack
 *
 * 2. RUN IN IFRAME: create iframe and load files from local filesystem
 * + independent window instance
 * + easy cleanup: just remove iframe
 * + better error handling: own onerror event in frame
 * + easy set any globals, no access to top window globals (only as window.parent.*)
 * - bugs with instanceof, iframe has own context: we need to load asserts separately, split fake-require function
 * - need to pass chrome object
 *
 * 3. RUN IN TOP WINDOW: load files from local filesystem in main window
 * - possible dirty top window
 * - manually remove all script tags with test-files
 * + no other problems as in #1 and #2
 *
 *
 * Currently we use #2 but maybe move to #3 in future.
 *
 * Input: Array<{code, path}>
 * Steps:
 * - clean up
 * - save local
 * - setup test runner
 * - inject local files as script tags
 * - wait until execution ends
 */

const path = require('path');
const promise = require('selenium-webdriver/lib/promise');
const utils = require('../utils');
const MochaRunner = require('./mocha-runner');
const FileRunner = require('./file-runner');
const htmlReporter = require('../reporter/html');
const globals = require('./globals');
const localFs = require('../utils/local-fs');
const engines = require('../engines');
const logger = require('../utils/logger').create('Runner');

class Runner {
  /**
   * Constructor
   */
  constructor() {
    this._localUrls = [];
    // todo: use custom flow
    // todo2: dont use flow at all :)
    this._flow = promise.controlFlow();
  }

  /**
   * Run tests
   *
   * @param {Object} params
   * @param {Array<{path, code}>} params.tests
   * @param {String} params.localBaseDir base directory to save test-files
   * @param {Object} params.uiWindow
   * @param {Boolean} params.noQuit
   * @param {String} params.engine
   */
  run(params) {
    // keep this abstraction if someday we will need run in iframe
    this._context = window;
    this._params = params;

    // todo: refactor - remove somewhere else
    const Targets = require('../extensiondriver/targets');
    Targets.dontCloseTabs = params.noQuit;

    return Promise.resolve()
      .then(() => this._cleanUp())
      .then(() => this._saveToLocalFs())
      .then(() => this._setupTestRunner())
      .then(() => this._setupGlobals())
      .then(() => this._runLocalUrls())
      .then(() => this._testRunner.tryRun())
      .then(() => logger.log('Done'))
  }

  /**
   * Save tests to local filesystem
   * Use serial approach as in parallel there are errors.
   */
  _saveToLocalFs() {
    return this._params.tests.reduce((res, test) => {
      const content = wrapCode(test.code);
      const localPath = path.join(this._params.localBaseDir, test.path);
      return res.then(() => localFs
        .save(localPath, content)
        .then(localUrl => this._localUrls.push(localUrl))
      )
    }, Promise.resolve())
  }

  _setupTestRunner() {
    const reporter = htmlReporter.getReporter(this._params.uiWindow);
    this._testRunner = new MochaRunner({
      reporter,
      uiWindow: this._params.uiWindow,
    });
    return this._testRunner.setup(this._context);
  }

  _setupGlobals() {
    globals.setGlobals(this._context, this._params.uiWindow);
    engines[this._params.engine].setGlobals(this._context);
  }

  _runLocalUrls() {
    return this._localUrls.reduce((res, url) => {
      return res
        .then(() => new FileRunner(url, this._context).run())
    }, Promise.resolve());
  }

  _cleanUp() {
    this._flow.reset();
    this._localUrls.length = 0;
    globals.clear(this._context);
    this._cleanScriptTags();
    // todo: remove cleaning whole dir in future
    return localFs.removeDir(this._params.localBaseDir);
  }

  _cleanScriptTags() {
    utils.removeBySelector('script[src^="filesystem:"]', this._context.document);
  }
}

function wrapCode(code) {
  return [
    '(function (console) { try { /* <=== Autotester wrapper */ ',
    code,
    '} catch(e) {__onTestFileError.dispatch(e)}})(uiConsole); /* <=== Autotester wrapper */'
  ].join('');
}

module.exports = Runner;
