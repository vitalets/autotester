/**
 * Constants
 * keyMirror should be used only for runtime constants!
 */

const keyMirror = require('keymirror');

exports.APP_STATE = keyMirror({
  LOADING: null,
  READY: null,
  TESTS_RUNNING: null,
  TESTS_DONE: null,
});

exports.FILES_SOURCE_TYPE = {
  INNER: 'INNER',
  URL: 'URL',
  BUILT_IN: 'BUILT_IN',
};

exports.TAB = {
  TESTS: 'TESTS',
  REPORT: 'REPORT',
  SETTINGS: 'SETTINGS',
};

exports.SETTINGS_MENU = {
  TESTS_SOURCE: 'TESTS_SOURCE',
  TARGETS: 'TARGETS',
  HUBS: 'HUBS',
};

exports.PROJECTS_DIR = 'projects';
