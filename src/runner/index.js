/**
 * Test runner
 * Loads tests from urls and run via mocha
 */

const utils = require('../utils');
const globals = require('./globals');
const RunFile = require('./run-file');
const runMocha = require('./run-mocha');
const logger = require('../utils/logger').create('Runner');

/**
 * Run tests
 *
 * @param {Object} params
 * @param {Array} params.urls
 * @param {Object} params.window
 * @param {Number} [params.timeout]
 * @returns {Promise}
 */
exports.run = function (params) {
  return Promise.resolve()
    .then(() => runMocha.setup(params))
    .then(() => fetchFiles(params.urls))
    .then(files => runFiles(files, params.window))
    .then(() => runMocha.hasTests() ? runMocha.run() : null)
    .then(() => finish())
};

function fetchFiles(urls) {
  return urls ? utils.fetchTextFromUrls(urls) : [];
}

function runFiles(files, win) {
  const runContext = {};
  return files.reduce((res, file) => {
    const args = globals.get({
      runContext: runContext,
      console: win.sharedConsole,
      __filename: file.url,
    });
    return res.then(() => new RunFile(file.text, file.url, args).run());
  }, Promise.resolve());
}

function finish() {
  logger.log('Finished');
}
