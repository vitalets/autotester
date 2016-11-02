/**
 * Top-level Run class
 */

const utils = require('../utils');
const Runner = require('./runner');
const engines = require('../engines');
const loopback = require('./loopback');
const extras = require('../extras');
const networkLogger = require('./network-logger');
const logger = require('../utils/logger').create('Run');

const RUNTIME_DIR = 'runtime';

module.exports = class Run {
  /**
   * Constructor
   *
   * @param {Object} options
   * @param {Object} options.uiWindow
   * @param {Boolean} options.devMode
   * @param {String} options.engine
   * @param {Object} options.target {loopback, serverUrl, caps, name}
   */
  constructor(options) {
    this._options = options;
    this._snippets = [];
    networkLogger.init();
    extras.setup();
    this._setupEngine();
    this._setupLoopback();
    this.runner = new Runner();
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
    return Promise.resolve()
      .then(() => this._fetchRemoteFiles(files, baseUrl))
      .then(() => this._run())
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
    return Promise.resolve()
      .then(() => this._run())
  }

  _run() {
    return this.runner.run({
      tests: this._snippets,
      localBaseDir: RUNTIME_DIR,
      uiWindow: this._options.uiWindow,
      devMode: this._options.devMode,
      engine: this._options.engine,
    });
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

  _fetchRemoteFiles(files, baseUrl) {
    this._snippets.length = 0;
    const tasks = files.map(file => {
      const url = utils.join(baseUrl, file);
      return utils.fetchText(url);
    });
    return Promise.all(tasks)
      .then(texts => {
        this._snippets = texts.map((text, index) => {
          return {
            path: files[index],
            code: text,
          };
        });
      });
  }
};
