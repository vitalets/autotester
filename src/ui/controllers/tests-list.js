/**
 * Working with tests list
 */

const mobx = require('mobx');
const state = require('../state');
const bgApi = require('./bg-api');
const {onError} = require('./internal-channels');
const {APP_STATE} = require('../state/constants');
const utils = require('../../utils');
const logger = require('../../utils/logger').create('Tests-list');

// todo: isLoading

exports.init = function () {
  mobx.reaction(() => state.filesSourceUrl, exports.load);
};

exports.load = mobx.action(function () {
  const url = state.filesSourceUrl;
  if (utils.isValidUrl(url)) {
    state.appState = APP_STATE.LOADING;
    return bgApi.loadTestsList(url).then(done, fail);
  } else {
    fail(new Error(`Invalid files url ${url}`));
  }
});

const done = mobx.action(function (data) {
  state.appState = APP_STATE.READY;
  if (data && Array.isArray(data.tests)) {
    logger.log('Files list loaded:', data.tests.length);
    const setupFiles = (data.setup || []).map(path => {
      return {path, isSetup: true};
    });
    const regularFiles = data.tests.map(path => {
      return {path};
    });
    state.outerFiles = setupFiles.concat(regularFiles);
  } else {
    fail(new Error(`No files found on ${state.filesSourceUrl}`));
  }
});

const fail = mobx.action(function(e) {
  state.outerFiles = [];
  state.appState = APP_STATE.READY;
  // todo: store.clearTests();
  onError.dispatch(e);
});
