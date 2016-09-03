/**
 * Runner that executes code and runs mocha if needed
 * Creates dynamic iframe element and loads via <script> tag
 * Advantages of such approach are:
 * - easy debug of tests (you can put breakpoint)
 * - normal error stack trace
 * - isolation of top window
 */

const promise = require('selenium-webdriver/lib/promise');
const seleniumTesting = require('./selenium-testing');
const utils = require('../utils');
const context = require('./context');
const FileRunner = require('./file-runner');
const MochaRunner = require('./mocha-runner');
const htmlReporter = require('../reporter/html');
const logger = require('../utils/logger').create('Runner');


class Runner {
  /**
   * Constructor
   */
  constructor() {
    // use default controlflow
    this._flow = promise.controlFlow();
  }

  /**
   * Runs array of code snippets
   *
   * @param {Object[]} files
   * @param {String} files[].code
   * @param {String} files[].path
   * @param {Object} [options]
   * @param {Object} [options.window]
   * @param {Number} [options.timeout]
   * @returns {Promise}
   */
  run(files, options) {
    this._flow.reset();
    this._files = Array.isArray(files) ? files : [];
    logger.log(`Running ${this._files.length} file(s)`);
    this._context = context.create({
      console: options.window.sharedConsole,
      report: options.window.document.getElementById('report'),
    });

    this._setupMocha(options);
    return this._runFiles()
      .then(() => this._mochaRunner.hasTests() ? this._mochaRunner.run() : null)
      .then(() => this._finish());
  }

  _createFrame() {
    return new Promise(resolve => {
      this._iframe = document.createElement('iframe');
      this._iframe.addEventListener('load', resolve);
      document.body.appendChild(this._iframe);
    });
  }

  _removeFrame() {
    this._iframe.parentNode.removeChild(this._iframe);
    this._iframe = null;
  }

  _finish() {
    logger.log(`Done`);
  }

  _setupTestRunner(options) {
    this._mochaRunner = new MochaRunner(this._context);
    this._mochaRunner.setup({
      reporter: htmlReporter.getReporter(options.window),
      timeout: options.timeout,
    });
  }

  _runFiles() {
    return this._files.reduce((res, file) => {
      return res.then(() => this._runFile(file));
    }, Promise.resolve());
  }

  _runFile(file) {
    this._context.__filename = file.path;
    // wrap before each file to add names to every `it` function for pretty error stack
    this._context.test.wrapMochaGlobals(this._context);
    return new FileRunner(file.code, file.path, this._context, this._flow).run();
  }
}

module.exports = Runner;
