/**
 * Working with tests list
 */

const mobx = require('mobx');
const store = require('../store').store;
const bgApi = require('./bg-api');
const {onError} = require('./internal-channels');
const utils = require('../../utils');
const logger = require('../../utils/logger').create('Tests-list');

exports.load = function () {
  const url = store.getTestsUrl();
  if (utils.isValidUrl(url)) {
    return bgApi.loadTestsList(url)
      .then(done, fail)
  } else {
    fail(new Error(`Invalid tests url ${url}`));
  }
};

const done = mobx.action(function (data) {
  if (data && Array.isArray(data.tests)) {
    logger.log('Tests loaded:', data.tests.length);
    store.testsSetup = data.setup || [];
    store.tests = data.tests || [];
    verifySelectedTest();
  } else {
    fail(new Error(`No tests found on ${store.getTestsUrl()}`));
  }
});

const fail = mobx.action(function(e) {
  store.clearTests();
  onError.dispatch(e);
});

// todo: move to store and run automatically on every tests change?
function verifySelectedTest() {
  if (store.selectedTest && store.tests.indexOf(store.selectedTest) === -1) {
    store.selectedTest = '';
  }
}
