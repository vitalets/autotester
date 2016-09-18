/**
 * Manage title text
 */

const {observer} = require('mobx-react');
const store = require('../store').store;
const {APP_STATE} = require('../store/constants');
const TITLE_PREFIX = chrome.runtime.getManifest().name;

const MSG = {
  INIT: 'loading...',
  READY: 'ready',
  TESTS_RUNNING: 'running...',
  TESTS_RUNNING_INDEX: 'running test #{i}...',
  TESTS_FINISHED: 'done',
};

module.exports = observer(function Title() {
  const msg = getMsgByAppState();
  document.title = TITLE_PREFIX + (msg ? ': ' + msg : '');
  return null;
});

function getMsgByAppState() {
  switch (store.appState) {
    case APP_STATE.INIT: return MSG.INIT;
    case APP_STATE.READY: return MSG.READY;
    default:
      return '';
  }
}

/*
exports.setListeners = function () {
  messaging.on(messaging.names.LOAD_TESTS_CONFIG_DONE, data => exports.set(exports.MSG_LOADED));
  messaging.on(messaging.names.RUN_TESTS_DONE, () => exports.set(exports.MSG_DONE));
};
*/
