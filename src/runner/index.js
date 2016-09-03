/**
 * Runner api
 */

const utils = require('../utils');
// const Runner = require('./runner');
const MochaRunner = require('./mocha-runner');
const ScriptRunner = require('./script-runner');
const Context = require('./context');
const globals = require('./globals');
const htmlReporter = require('../reporter/html');
const logger = require('../utils/logger').create('Runner');

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
exports.runFiles = function (files, options) {
  return new Runner().run(files, options);
};

/**
 * Run urls
 *
 * @param {Array<String>} urls
 * @param {Object} options
 * @param {Object} options.uiWindow
 * @returns {Promise}
 */
exports.runUrls = function (urls, options) {
  logger.log(`Executing ${urls.length} file(s)`);
  const globalVars = globals.get(options.uiWindow);
  const context = new Context();
  //const mochaRunner = new MochaRunner();
  return Promise.resolve()
    .then(() => context.prepare(globalVars))
    //.then(() => mochaRunner.prepare(context.document))
    .then(() => processUrls(urls, context.document))
    //.then(() => mochaRunner.hasTests() ? mochaRunner.run() : null)
    .then(() => context.clear())
    .then(() => finish())
};

/*
function fetchFiles(urls = []) {
  const tasks = urls.map(url => {
    return utils.fetchText(url)
      .then(text => {
        return {code: text, path: url};
      });
  });
  return Promise.all(tasks);
}
*/

function processUrls(urls, document) {
  return urls.reduce((res, url) => {
    return res.then(() => new ScriptRunner(url, document).run());
  }, Promise.resolve());
}

function finish() {
  logger.log('Done');
}

function getGlobals() {

}
