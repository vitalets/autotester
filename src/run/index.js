/**
 * Run api
 */

const path = require('path');
const utils = require('../utils');
const Runner = require('./runner');
const logger = require('../utils/logger').create('Run');

const LOCAL_TESTS_DIR = 'test';
const LOCAL_SNIPPETS_DIR = 'snippets';

// temp
const fakeHttp = require('../utils/fake-http');
const extensionDriver = require('../extensiondriver');
fakeHttp.setHandler(extensionDriver.handler);

// todo: move somethere!!
// set process.platfom for correct work of selenium-webdriver/net/index.js
const os = require('os');
process.platform = 'darwin';
// for safari
process.env.USER = 'USER';
process.env.APPDATA = 'APPDATA';


process.env.SELENIUM_REMOTE_URL = 'http://127.0.0.1:4444/wd/hub';
//process.env.SELENIUM_REMOTE_URL = 'http://ondemand.saucelabs.com:80/wd/hub';
process.env.SELENIUM_BROWSER = 'chrome';
//process.env.SELENIUM_BROWSER = 'firefox';
//process.env.SELENIUM_BROWSER = 'safari';

os.networkInterfaces = os.getNetworkInterfaces = function () {
  return {
    lo0: [{
      family: 'IPv4',
      internal: true,
      address: 'localhost',
    }]
  };
};




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
