/**
 * Working with tests list
 */

const mobx = require('mobx');
const store = require('../store').store;
const bgApi = require('./bg-api');

exports.load = function () {
  return bgApi.loadTestsList()
    .then(mobx.action(success))
};

function success(data) {
  if (!data) {
    console.error('tests list not loaded', data);
    return;
  }
  console.log('tests list loaded', data.config.tests.length);
  store.tests = data.config.tests || [];
  verifySelectedTest();
}

function verifySelectedTest() {
  if (store.selectedTest && store.tests.indexOf(store.selectedTest) === -1) {
    store.selectedTest = '';
  }
}
