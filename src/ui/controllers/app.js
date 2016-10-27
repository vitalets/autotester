/**
 * Main ui entry
 */

const mobx = require('mobx');
const fs = require('bro-fs');
const state = require('../state');
const {APP_STATE} = require('../state/constants');
const bgApi = require('./bg-api');
const windowApi = require('./window-api');
const testsRun = require('./tests-run');
const configLoader = require('./config-loader');
const htmlConsole = require('./html-console');
const setup = require('./setup');
const editor = require('./editor');

/**
 * Start app
 */
exports.start = function() {
  htmlConsole.init();
  testsRun.init();
  configLoader.init();
  editor.init();
  bgApi.init();
  windowApi.init();
  return Promise.resolve()
    .then(() => fs.init({type: window.PERSISTENT, requestQuota: false}))
    .then(() => setup.applyOnFirstRun())
    .then(() => state.load())
    .then(mobx.action(ready));
};

function ready() {
  state.appState = APP_STATE.READY;
}
