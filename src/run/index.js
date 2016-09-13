/**
 * Top-level Run class
 */

const path = require('path');
const utils = require('../utils');
const Runner = require('./runner');
const engines = require('../engines');
const loopback = require('./loopback');
const extras = require('../extras');
const logger = require('../utils/logger').create('Run');

const LOCAL_TESTS_DIR = 'test';
const LOCAL_SNIPPETS_DIR = 'snippets';

module.exports = class Run {
  /**
   * Constructor
   *
   * @param {Object} options
   * @param {Object} options.uiWindow
   * @param {Boolean} options.noQuit
   * @param {String} options.engine
   * @param {Object} options.target {serverUrl, caps, name}
   */
  constructor(options) {
    this._options = options;
    this._snippets = [];
    this._localBaseDir = null;
    this._setupExtras();
    this._setupEngine();
    this._setupLoopback();
  }

  /**
   * Run scenarios from array of remote files (paths) and baseUrl
   *
   * @param {Array<String>} files relative filepaths
   * @param {String} baseUrl
   * @returns {Promise}
   */
  runRemoteFiles(files, baseUrl) {
    logger.log(`Running ${files.length} file(s)`);
    this._localBaseDir = LOCAL_TESTS_DIR;
    return Promise.resolve()
      .then(() => this._fetchRemoteFiles(files, baseUrl))
      .then(() => this._run());
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
    return this._run();
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

  _setupExtras() {
    extras.setup();
  }

  _setupEngine() {
    logger.log(`Using target: ${this._options.target.name}`);
    const engine = engines[this._options.engine];
    engine.setServerUrl(this._options.target.serverUrl);
    engine.setCapabilities(this._options.target.caps);
  }

  _setupLoopback() {
    if (this._options.target.loopback) {
      loopback.setup(this._options.target.serverUrl);
    }
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
};
