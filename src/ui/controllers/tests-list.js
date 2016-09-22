/**
 * Working with tests list
 */

const mobx = require('mobx');
const store = require('../store').store;
const bgApi = require('./bg-api');
const {onError} = require('./internal-channels');
const utils = require('../../utils');

exports.load = function () {
  if (utils.isValidUrl(store.testsSourceUrl)) {
    return bgApi.loadTestsList(store.testsSourceUrl)
      .then(success, fail)
  } else {
    fail(new Error(`Invalid tests url ${store.testsSourceUrl}`));
  }
};

const success = mobx.action(function (data) {
  if (data && Array.isArray(data.tests)) {
    console.log('Tests loaded:', data.tests.length);
    store.testsSetup = data.setup || [];
    store.tests = data.tests || [];
    verifySelectedTest();
  } else {
    fail(new Error(`No tests found on ${store.testsSourceUrl}`));
  }
});

function fail(e) {
  store.clearTests();
  onError.dispatch(e);
}

// todo: move to store and run automatically on every tests change?
function verifySelectedTest() {
  if (store.selectedTest && store.tests.indexOf(store.selectedTest) === -1) {
    store.selectedTest = '';
  }
}
