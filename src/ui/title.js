/**
 * Manage title text
 */

const messaging = require('../background/messaging');

const TITLE_PREFIX = chrome.runtime.getManifest().name;

exports.MSG_LOADING = 'loading...';
exports.MSG_LOADED = 'loaded';
exports.MSG_RUNNING = 'running...';
exports.MSG_RUNNING_INDEX = 'running test #{i}...';
exports.MSG_DONE = 'done';

exports.set = function (status) {
  document.title = TITLE_PREFIX + (status ? ': ' + status : '');
};

exports.setListeners = function () {
  messaging.on(messaging.names.LOAD_TESTS_CONFIG_DONE, data => exports.set(exports.MSG_LOADED));
  messaging.on(messaging.names.RUN_TESTS_DONE, () => exports.set(exports.MSG_DONE));
};
