/**
 * Runner api
 */

const utils = require('../utils');
const Runner = require('./runner');

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
 * @param {Object} options.window
 * @param {Number} [options.timeout]
 * @returns {Promise}
 */
exports.runUrls = function (urls, options) {
  return fetchFiles(urls)
    .then(files => exports.runFiles(files, options));
};

function fetchFiles(urls = []) {
  const tasks = urls.map(url => {
    return utils.fetchText(url)
      .then(text => {
        return {code: text, path: url};
      });
  });
  return Promise.all(tasks);
}
