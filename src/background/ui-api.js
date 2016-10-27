/**
 * Communication with ui page
 */

const messaging = require('../utils/messaging');
const externalEvents = require('./external-events');
const testsRun = require('./tests-run');
const {
  onTestsDone,
  onReady,
  onSessionStarted,
  onFileStarted,
  onTestStarted,
} = require('./internal-channels');

const {
  RELOAD,
  TESTS_RUN,
  TESTS_DONE,
  SESSION_STARTED,
  FILE_STARTED,
  TEST_STARTED,
} = externalEvents;

exports.init = function() {
  messaging.registerEvents(externalEvents);
  messaging.on(TESTS_RUN, runTests);
  onReady.addListener(() => messaging.send(RELOAD));
  onTestsDone.addListener(() => messaging.send(TESTS_DONE));
  // todo: make this channeling in more automatic way (e.g. event flag isExternal: true)
  // todo: think also about disabling bi-directional external channels to avoid cyclic flow
  onSessionStarted.addListener(data => messaging.send(SESSION_STARTED, data));
  onFileStarted.addListener(data => messaging.send(FILE_STARTED, data));
  onTestStarted.addListener(data => messaging.send(TEST_STARTED, data));
  messaging.start();
};

function runTests(data) {
  testsRun.run(data)
}
