/**
 * Working with tests list
 */

const mobx = require('mobx');
const state = require('../state');
const bgApi = require('./bg-api');
const {onError} = require('./internal-channels');
const utils = require('../../utils');
const logger = require('../../utils/logger').create('Tests-list');

exports.load = function () {
  const url = state.filesSourceUrl;
  if (utils.isValidUrl(url)) {
    return bgApi.loadTestsList(url)
      .then(done, fail)
  } else {
    fail(new Error(`Invalid files url ${url}`));
  }
};

const done = mobx.action(function (data) {
  if (data && Array.isArray(data.tests)) {
    logger.log('Files list loaded:', data.tests.length);
    const setupFiles = (data.setup || []).map(path => {
      return {path, setup: true};
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
  // todo: store.clearTests();
  onError.dispatch(e);
});
