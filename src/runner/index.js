/**
 * Runner
 *
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
 */

const path = require('path');
const utils = require('../utils');
// const Runner = require('./runner');
const MochaRunner = require('./mocha-runner');
const htmlReporter = require('../reporter/html');
const ScriptRunner = require('./script-runner');
const globals = require('./globals');
const localFs = require('./local-fs');

const logger = require('../utils/logger').create('Runner');

const LOCAL_TEST_DIR = 'test';
const LOCAL_SNIPPET_DIR = 'snippets';



/**
 * Run files
 *
 * @param {Object[]} files
 * @param {String} files[].code
 * @param {String} files[].path
 * @param {Object} options
 * @param {Object} options.window
 * @param {Number} [options.timeout]
 * @returns {Promise}
 */
// exports.runFiles = function (files, options) {
//   return new Runner().run(files, options);
// };

/**
 * Run urls
 *
 * @param {Array<String>} files relative filepaths
 * @param {Object} options
 * @param {String} options.baseUrl
 * @param {Object} options.uiWindow
 * @returns {Promise}
 */
exports.runFiles = function (files, options) {
  logger.log(`Executing ${files.length} file(s)`);
  const context = window;
  const reporter = htmlReporter.getReporter(options.uiWindow);
  const testRunner = new MochaRunner({reporter});
  return Promise.resolve()
    .then(() => testRunner.setup(context))
    .then(() => globals.export(context, options.uiWindow))
    .then(() => processFiles(files, options.baseUrl, context))
    .then(() => testRunner.hasTests() ? testRunner.run() : null)
    .then(() => logger.log('Done'))
};

/*
function fetchUrls(urls = []) {
  const tasks = urls.map(url => {
    return utils.fetchText(url)
      .then(text => {
        return {text, url};
      });
  });
  return Promise.all(tasks);
}
*/


function processFiles(files, baseUrl, context) {
  removePreviousFiles(context);
  return files.reduce((res, filepath) => {
    return res.then(() => processFile(baseUrl, filepath, context))
  }, Promise.resolve());
}

function processFile(baseUrl, filepath, context) {
  const url = path.join(baseUrl, filepath);
  const localPath = path.join(LOCAL_TEST_DIR, filepath);
  return Promise.resolve()
    .then(() => localFs.download(url, localPath))
    .then(localUrl => new ScriptRunner(localUrl, context).run());
}

function removePreviousFiles(context) {
  utils.removeBySelector('script[src^="filesystem:"]', context.document);
}
