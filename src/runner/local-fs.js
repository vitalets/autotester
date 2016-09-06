/**
 * Downloads external url to local filesystem sandbox.
 * Wraps code into anonymous self-called function to isolate scope.
 */

const path = require('path');
var promisifyAll = require('es6-promisify-all');
var fs = promisifyAll(require('html5-fs'));
const utils = require('../utils');
const logger = require('../utils/logger').create('LocalFs');

let fsInited = false;

/**
 * Downloads url to local fs
 *
 * @param {String} url
 * @param {String} filepath
 * @returns {Promise<String>}
 */
exports.download = function (url, filepath) {
  logger.log(`Downloading: ${url} to ${filepath}`);
  return Promise.resolve()
    .then(() => utils.fetchText(url))
    .then(code => exports.save(filepath, code));
};

/**
 * Save code to local fs with specified filename
 *
 * @param {String} filepath
 * @param {String} code
 */
exports.save = function (filepath, code) {
  const wrappedCode = wrapAsAnonymousFn(code);
  return Promise.resolve()
    .then(() => ensureFs())
    .then(() => ensurePath(filepath))
    .then(() => saveFile(filepath, wrappedCode))
    .then(localUrl => {
      logger.log(`Saved: ${localUrl}`);
      return localUrl;
    })
};

function wrapAsAnonymousFn(text) {
  return `(function () { /* <=== Autotester wrapper */ ${text}})(); /* <=== Autotester wrapper */`;
}

function ensureFs() {
  return fsInited ? Promise.resolve() : fs.initAsync(0).then(() => fsInited = true);
}

function saveFile(filepath, data) {
  return Promise.resolve()
    .then(() => fs.existsAsync(filepath))
    .then(exists => exists ? fs.unlinkAsync(filepath) : null)
    .then(() => fs.writeFileAsync(filepath, data));
}

function ensurePath(filepath) {
  // slice last part to remove file itself
  const parts = filepath.split('/').filter(Boolean).slice(0, -1);
  return parts.reduce((res, part, i) => {
    const curerntPath = parts.slice(0, i + 1).join('/');
    return res.then(() => fs.statAsync(curerntPath + '/'))
      .catch(e => {
        if (e && e.name === 'NotFoundError') {
          logger.log(`Creating dir: ${curerntPath}`);
          return fs.mkdirAsync(curerntPath);
        }
      })
  }, Promise.resolve());
}

/*
// remove recursively
function removeDir() {
  fs.getFsInstance((err, fss) => {
    fss.root.getDirectory('tests', {create: false}, dir => {
      dir.removeRecursively(() => {
        console.log('removeRecursively')
      });
    })
  })
}
*/
