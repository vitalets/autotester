/**
 * Top-level Run class
 */

const path = require('path');
const Channel = require('chnl');
const utils = require('../utils');
const Runner = require('./runner');
const engines = require('../engines');
const loopback = require('./loopback');
const extras = require('../extras');
const httpAlias = require('../alias/http');
const networkLogger = require('./network-logger');
const logger = require('../utils/logger').create('Run');

const LOCAL_TESTS_DIR = 'test';
const LOCAL_SNIPPETS_DIR = 'snippets';

const NEW_SESSION_RESPONSE_REGEXP = /"webdriver\.remote\.sessionid"\s*:\s*"([^"]+)"/;

module.exports = class Run {
  /**
   * Constructor
   *
   * @param {Object} options
   * @param {Object} options.uiWindow
   * @param {Boolean} options.noQuit
   * @param {String} options.engine
   * @param {Object} options.target {loopback, serverUrl, caps, name}
   */
  constructor(options) {
    this._options = options;
    this._snippets = [];
    this._localBaseDir = null;
    this._setupNetworkLogger();
    this._setupExtras();
    this._setupEngine();
    this._setupLoopback();
    this._setupEvents();
  }

  /**
   * Run scenarios from array of remote files (paths) and baseUrl
   *
   * @param {Array<String>} files relative filepaths
   * @param {String} baseUrl
   * @returns {Promise}
   */
  runRemoteFiles(files, baseUrl) {
    logger.log(`Running ${files.length} file(s) from baseUrl: ${baseUrl}`);
    this._localBaseDir = LOCAL_TESTS_DIR;
    return Promise.resolve()
      .then(() => this._fetchRemoteFiles(files, baseUrl))
      .then(() => this._run())
      .then(() => this._done(), e => this._fail(e));
  }

  /**
   * Run snippets
   *
   * @param {Array<{path, code}>} snippets
   * @returns {Promise}
   */
  runSnippets(snippets) {
    logger.log(`Running ${snippets.length} snippet(s)`);
    this._snippets = snippets;
    this._localBaseDir = LOCAL_SNIPPETS_DIR;
    return Promise.resolve()
      .then(() => this._run())
      .then(() => this._done(), e => this._fail(e));
  }

  _run() {
    return new Runner().run({
      tests: this._snippets,
      localBaseDir: this._localBaseDir,
      uiWindow: this._options.uiWindow,
      noQuit: this._options.noQuit,
      engine: this._options.engine,
    });
  }

  _setupNetworkLogger() {
    networkLogger.init();
  }

  _setupExtras() {
    extras.setup();
  }

  _setupEngine() {
    logger.log(`Running on target:`, this._options.target);
    const engine = engines[this._options.engine];
    engine.setServerUrl(this._options.target.serverUrl);
    engine.setCapabilities(this._options.target.caps);
  }

  _setupLoopback() {
    if (this._options.target.loopback) {
      loopback.setup(this._options.target.serverUrl);
    }
  }

  _setupEvents() {
    this._subscription = new Channel.Subscription([
      {channel: httpAlias.onResponse, listener: this._onHttpResponse.bind(this)}
    ]).on();
    this.onSessionStarted = new Channel();
  }

  _fetchRemoteFiles(files, baseUrl) {
    this._snippets.length = 0;
    const tasks = files.map(file => {
      const url = path.join(baseUrl, file);
      return utils.fetchText(url)
        .then(text => this._snippets.push({path: file, code: text}));
    });
    return Promise.all(tasks);
  }

  _done() {
    this._cleanUp();
    logger.log('Done');
  }

  _fail(e) {
    this._cleanUp();
    logger.log('Failed');
    throw e;
  }

  _cleanUp() {
    this._subscription.off();
  }

  _onHttpResponse({data}) {
    const matches = data.match(NEW_SESSION_RESPONSE_REGEXP);
    if (matches) {
      this.onSessionStarted.dispatch({
        sessionId: matches[1],
        options: this._options,
      });
    }
  }
};
