/**
 * Communication with ui page
 */

const messaging = require('../utils/messaging');
const eventNames = require('./event-names');
const testsList = require('./tests-list');
const testsRun = require('./tests-run');

const {
  RELOAD,
  TESTS_LIST_LOAD,
  TESTS_RUN,
  TESTS_DONE,
} = eventNames;

exports.init = function() {
  messaging.registerEvents(eventNames);
  messaging.on(TESTS_LIST_LOAD, loadTestsList);
  messaging.on(TESTS_RUN, runTests);
  messaging.start();
};

exports.reloadUI = function() {
  messaging.send(RELOAD);
};

exports.testsDone = function() {
  messaging.send(TESTS_DONE);
};

function loadTestsList() {
  console.log('loadTestsList')
}

function runTests() {
  console.log('runTests')
}
