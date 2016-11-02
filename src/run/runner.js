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

const Channel = require('chnl');
const promise = require('selenium-webdriver/lib/promise');
const fs = require('bro-fs');
const utils = require('../utils');
const httpAlias = require('../alias/http');
const MochaRunner = require('./test-runners/mocha');
const FileRunner = require('./file-runner');
const globals = require('./globals');
const engines = require('../engines');
const logger = require('../utils/logger').create('Runner');

const DEFAULT_TEST_RUNNER_OPTIONS = {
  timeout: 30 * 1000,
  bail: false,
};

class Runner {
  /**
   * Constructor
   */
  constructor() {
    this._localUrls = [];
    // todo: use custom flow
    // todo2: dont use flow at all :)
    this._flow = promise.controlFlow();
    // start of file execution
    this.onFileStarted = new Channel();
    // start of test execution
    this.onTestStarted = new Channel();
    // webdriver session started
    this.onSessionStarted = new Channel();
  }

  /**
   * Run tests
   *
   * @param {Object} params
   * @param {Array<{path, code, isSetup}>} params.tests
   * @param {String} params.localBaseDir base directory to save test-files
   * @param {Object} params.uiWindow
   * @param {Boolean} params.devMode
   * @param {String} params.engine
   */
  run(params) {
    // keep this abstraction if someday we will need run in iframe
    this._context = window;
    this._params = params;

    // todo: refactor - remove somewhere else
    const Targets = require('../extensiondriver/targets');
    Targets.dontCloseTabs = params.devMode;

    return Promise.resolve()
      .then(() => this._cleanBefore())
      .then(() => this._listenHttp())
      .then(() => this._saveToLocalFs())
      .then(() => this._setupTestRunner())
      .then(() => this._setupGlobals())
      .then(() => this._runLocalUrls())
      .then(() => this._testRunner.tryRun())
      .then(() => this._done(), e => this._fail(e));
  }

  /**
   * Save tests to local filesystem
   * Use serial approach as in parallel there are errors.
   */
  _saveToLocalFs() {
    return this._params.tests.reduce((res, test) => {
      const content = wrapCode(test.code);
      const localPath = utils.join(this._params.localBaseDir, test.path);
      return res
        .then(() => fs.writeFile(localPath, content))
        .then(entry => this._localUrls.push(entry.toURL()))
    }, Promise.resolve())
  }

  _setupTestRunner() {
    const options = Object.assign({}, DEFAULT_TEST_RUNNER_OPTIONS, {
      uiWindow: this._params.uiWindow,
      bail: this._params.devMode,
    });
    this._testRunner = new MochaRunner(options);
    this._testRunner.onTestStarted.addListener(data => this.onTestStarted.dispatch(data));
    return this._testRunner.loadTo(this._context);
  }

  _setupGlobals() {
    globals.setGlobals(this._context, this._params.uiWindow);
    engines[this._params.engine].setGlobals(this._context);
  }

  _runLocalUrls() {
    const count = this._localUrls.length;
    return this._localUrls.reduce((res, url, index) => {
      return res
        .then(() => this.onFileStarted.dispatch({index, count, url}))
        .then(() => new FileRunner(url, this._context).run())
    }, Promise.resolve());
  }

  _listenHttp() {
    this._subscription = new Channel.Subscription([
      {
        channel: httpAlias.onResponse,
        listener: this._onHttpResponse.bind(this)
      }
    ]).on();
  }

  _done() {
    this._cleanAfter();
    logger.log('Done');
  }

  _fail(e) {
    try {
      this._cleanAfter();
    } catch (err) {
      logger.error('Nested error', err);
    }
    throw e;
  }

  _cleanBefore() {
    this._flow.reset();
    this._localUrls.length = 0;
    globals.clear(this._context);
    // todo: dont clean whole dir in future, but currently keep it to test performance
    return fs.rmdir(this._params.localBaseDir);
  }

  _cleanAfter() {
    this._cleanScriptTags();
    if (this._subscription) {
      this._subscription.off();
    }
    globals.clear(this._context);
  }

  _cleanScriptTags() {
    utils.removeBySelector('script[src^="filesystem:"]', this._context.document);
  }

  _onHttpResponse({request, options, data}) {
    if (isNewSessionRequest(request, options)) {
      try {
        const parsed = JSON.parse(data);
        this.onSessionStarted.dispatch({
          sessionId: parsed.sessionId,
          options: this._options,
          response: parsed,
        });
      } catch (e) {
        logger.error(`Can not parse response data`, e, data);
      }
    }
  }
}

function isNewSessionRequest(request, options) {
  return options.method === 'POST' && request.uri.endsWith('/session');
}

function wrapCode(code) {
  return [
    '(function (console) { try { /* <=== Autotester wrapper */ ',
    code,
    '} catch(e) {__onTestFileError.dispatch(e)}})(uiConsole); /* <=== Autotester wrapper */'
  ].join('');
}

module.exports = Runner;
