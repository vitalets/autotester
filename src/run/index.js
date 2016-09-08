/**
 * Run api
 */

const path = require('path');
const utils = require('../utils');
const Runner = require('./runner');
const logger = require('../utils/logger').create('Run');

const LOCAL_TESTS_DIR = 'test';
const LOCAL_SNIPPETS_DIR = 'snippets';

/**
 * Run scenarios from array of remote files (paths) and baseUrl
 *
 * @param {Array<String>} files relative filepaths
 * @param {Object} options
 * @param {String} options.baseUrl
 * @param {Object} options.uiWindow
 * @param {Boolean} options.noQuit
 * @returns {Promise}
 */
exports.runRemoteFiles = function (files, options) {
  logger.log(`Running ${files.length} file(s)`);
  return Promise.resolve()
    .then(() => fetchFiles(files, options.baseUrl))
    .then(tests => new Runner().run({
      tests,
      localBaseDir: LOCAL_TESTS_DIR,
      uiWindow: options.uiWindow,
      noQuit: options.noQuit,
    }));
};

/**
 * Run snippets
 *
 * @param {Array<{path, code}>} snippets
 * @param {Object} options
 * @param {Object} options.uiWindow
 * @param {Boolean} options.noQuit
 * @returns {Promise}
 */
exports.runSnippets = function (snippets, options) {
  logger.log(`Running ${snippets.length} snippet(s)`);
  return new Runner().run({
    tests: snippets,
    localBaseDir: LOCAL_SNIPPETS_DIR,
    uiWindow: options.uiWindow,
    noQuit: options.noQuit,
  });
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
