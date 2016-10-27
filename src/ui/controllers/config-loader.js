/**
 * Loads tests config from url
 */

const mobx = require('mobx');
const state = require('../state');
const {onError} = require('./internal-channels');
const {APP_STATE} = require('../state/constants');
const utils = require('../../utils');
const evaluate = require('../../utils/evaluate');
const logger = require('../../utils/logger').create('Config-loader');

// todo: isLoading flag to reject parallel requests

/**
 * Initially subscribe to changes of filesSourceUrl to reload config automatically
 */
exports.init = function () {
  mobx.reaction(() => state.filesSourceUrl, exports.load);
};

/**
 * Loads config from current url
 */
exports.load = mobx.action(function () {
  const url = state.filesSourceUrl;
  if (utils.isValidUrl(url)) {
    state.appState = APP_STATE.LOADING;
    logger.log(`Loading config from: ${url}`);
    return utils.fetchText(url)
      .then(text => processConfig(text, url))
      .then(done, fail);
  } else {
    fail(new Error(`Invalid config url ${url}`));
  }
});

const done = mobx.action(function (config) {
  const setupFiles = config.setup.map(path => {
    return {path, isSetup: true};
  });
  const regularFiles = config.tests.map(path => {
    return {path, isSetup: false};
  });
  state.appState = APP_STATE.READY;
  state.outerFiles = setupFiles.concat(regularFiles);
  logger.log(`Config loaded:`, config);
});

const fail = mobx.action(function(e) {
  state.outerFiles = [];
  state.appState = APP_STATE.READY;
  // todo: store.clearTests();
  onError.dispatch(e);
});

function processConfig(text, url) {
  const config = evaluate.asCommonJs(url, text);
  validateConfig(config);
  return config;
}

function validateConfig(config) {
  if (!config) {
    throw new Error('Config is empty');
  }
  if (typeof config !== 'object') {
    throw new Error('Config should be object');
  }
  if (!Array.isArray(config.setup)) {
    config.setup = [];
  }
  if (!Array.isArray(config.tests)) {
    config.tests = [];
  }
}
