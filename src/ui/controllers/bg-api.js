/**
 * Communication with bg page
 */

const messaging = require('../../utils/messaging');
const externalEvents = require('../../background/external-events');
const {
  onTestsDone,
  onSessionStarted,
  onFileStarted,
  onTestStarted,
} = require('../controllers/internal-channels');

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
  messaging.on(RELOAD, () => location.reload());
  messaging.on(TESTS_DONE, () => onTestsDone.dispatch());
  // todo: make this channeling in more automatic way (e.g. event flag isExternal: true)
  messaging.on(SESSION_STARTED, data => onSessionStarted.dispatch(data));
  messaging.on(FILE_STARTED, data => onFileStarted.dispatch(data));
  messaging.on(TEST_STARTED, data => onTestStarted.dispatch(data));
  messaging.start();
};

exports.runTests = function(data) {
  return messaging.send(TESTS_RUN, data);
};
