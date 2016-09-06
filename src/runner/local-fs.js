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
 * Save local file with specified content
 *
 * @param {String} filepath
 * @param {String} content
 */
exports.save = function (filepath, content) {
  return Promise.resolve()
    .then(() => ensureFs())
    .then(() => ensurePath(filepath))
    .then(() => saveFile(filepath, content))
    .then(localUrl => {
      logger.log(`Saved: ${localUrl}`);
      return localUrl;
    })
};

/**
 * Recursively remove dir and all subdirs
 *
 * @param {String} dir
 */
exports.removeDir = function (dir) {
  return Promise.resolve()
    .then(() => ensureFs())
    .then(() => fs.getFsInstanceAsync())
    .then(fsInstance => getDirectory(fsInstance, dir))
    .then(dirEntry => removeRecursively(dirEntry))
    .catch(e => e.name === 'NotFoundError' ? null : Promise.reject(e))
};

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

function getDirectory(fsInstance, dir) {
  const options = {create: false};
  return new Promise((resolve, reject) => fsInstance.root.getDirectory(dir, options, resolve, reject));
}

function removeRecursively(dirEntry) {
  return new Promise((resolve, reject) => dirEntry.removeRecursively(resolve, reject));
}
