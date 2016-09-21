/**
 * Communication with ui page
 */

const messaging = require('../utils/messaging');
const externalEvents = require('./external-events');
const testsList = require('./tests-list');
const testsRun = require('./tests-run');
const {onTestsDone, onReady} = require('./internal-channels');

const {
  RELOAD,
  TESTS_LIST_LOAD,
  TESTS_RUN,
  TESTS_DONE,
} = externalEvents;

exports.init = function() {
  messaging.registerEvents(externalEvents);
  messaging.on(TESTS_LIST_LOAD, loadTestsList);
  messaging.on(TESTS_RUN, runTests);
  onReady.addListener(() => messaging.send(RELOAD));
  onTestsDone.addListener(() => messaging.send(TESTS_DONE));
  messaging.start();
};

function loadTestsList() {
  console.log('loadTestsList')
}

function runTests(data) {
  console.log('running tests');
  testsRun.run(data)
}
