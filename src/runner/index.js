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
const MochaRunner = require('./mocha-runner');
const htmlReporter = require('../reporter/html');
const ScriptRunner = require('./script-runner');
const globals = require('./globals');
const localFs = require('./local-fs');
const logger = require('../utils/logger').create('Runner');

const LOCAL_TEST_DIR = 'test';
const LOCAL_SNIPPETS_DIR = 'snippets';

/**
 * Run scenarios from array of remote files (paths) and baseUrl
 *
 * @param {Array<String>} files relative filepaths
 * @param {Object} options
 * @param {String} options.baseUrl
 * @param {Object} options.uiWindow
 * @returns {Promise}
 */
exports.runRemoteFiles = function (files, options) {
  logger.log(`Running ${files.length} file(s)`);
  return Promise.resolve()
    // temp
    .then(() => localFs.removeDir(LOCAL_TEST_DIR))
    .then(() => fetchFiles(files, options.baseUrl))
    .then(items => saveLocal(items, LOCAL_TEST_DIR))
    .then(localUrls => runLocalUrls(localUrls, options))
};

/**
 * Run snippets
 *
 * @param {Array<{path, code}>} snippets
 * @param {Object} options
 * @param {Object} options.uiWindow
 * @returns {Promise}
 */
exports.runSnippets = function (snippets, options) {
  logger.log(`Running ${snippets.length} snippet(s)`);
  return Promise.resolve()
    // temp
    .then(() => localFs.removeDir(LOCAL_SNIPPETS_DIR))
    .then(() => saveLocal(snippets, LOCAL_SNIPPETS_DIR))
    .then(localUrls => runLocalUrls(localUrls, options))
};

function fetchFiles(files, baseUrl) {
  const tasks = files.map(file => {
    const url = path.join(baseUrl, file);
    return utils.fetchText(url)
      .then(text => {
        return {path: file, code: text};
      });
  });
  return Promise.all(tasks);
}

/**
 * Save snippets to local filesystem
 * Use serial approach as in parallel there are errors.
 *
 * @param {Array<{path, code}>} snippets
 * @param {String} baseDir
 * @returns {*}
 */
function saveLocal(snippets, baseDir) {
  return snippets.reduce((res, snippet) => {
    const content = wrapCode(snippet.code);
    const localPath = path.join(baseDir, snippet.path);
    return res
      .then(urls => {
        return localFs.save(localPath, content)
          .then(localUrl => urls.concat([localUrl]))
      })
  }, Promise.resolve([]));
}

function runLocalUrls(urls, options) {
  const context = window;
  const reporter = htmlReporter.getReporter(options.uiWindow);
  const testRunner = new MochaRunner({reporter});
  return Promise.resolve()
    .then(() => testRunner.setup(context))
    .then(() => globals.export(context, options.uiWindow))
    .then(() => processLocalUrls(urls, context))
    .then(() => testRunner.hasTests() ? testRunner.run() : null)
    .then(() => logger.log('Done'))
}

function processLocalUrls(urls, context) {
  cleanUp(context);
  return urls.reduce((res, url) => {
    return res
      .then(() => new ScriptRunner(url, context).run())
  }, Promise.resolve());
}

function cleanUp(context) {
  utils.removeBySelector('script[src^="filesystem:"]', context.document);
}

function wrapCode(code) {
  return [
    '(function (console) { try { /* <=== Autotester wrapper */ ',
    code,
    '} catch(e) {__onTestFileError.dispatch(e)}})(uiConsole); /* <=== Autotester wrapper */'
  ].join('');
}
