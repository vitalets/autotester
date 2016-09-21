/**
 * Communication with bg page
 */

const messaging = require('../../utils/messaging');
const externalEvents = require('../../background/external-events');
const {onTestsDone} = require('../controllers/internal-channels');

const {
  RELOAD,
  TESTS_LIST_LOAD,
  TESTS_RUN,
  TESTS_DONE,
} = externalEvents;

exports.init = function() {
  messaging.registerEvents(externalEvents);
  messaging.on(RELOAD, () => location.reload());
  messaging.on(TESTS_DONE, () => onTestsDone.dispatch());
  messaging.start();
};

exports.loadTestsList = function() {
  return messaging.send(TESTS_LIST_LOAD);
};

exports.runTests = function(data) {
  return messaging.send(TESTS_RUN, data);
};
