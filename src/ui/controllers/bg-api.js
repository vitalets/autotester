/**
 * Communication with bg page
 */

const messaging = require('../../utils/messaging');
const eventNames = require('../../background/event-names');
const {onTestsDone} = require('../controllers/internal-events');

const {
  RELOAD,
  TESTS_LIST_LOAD,
  TESTS_RUN,
  TESTS_DONE,
} = eventNames;

exports.init = function() {
  messaging.registerEvents(eventNames);
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
