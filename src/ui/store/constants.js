
const keyMirror = require('keymirror');

exports.APP_STATE = keyMirror({
  LOADING: null,
  READY: null,
  TESTS_RUNNING: null,
  TESTS_DONE: null,
});

exports.TESTS_SOURCE_TYPE = keyMirror({
  SNIPPETS: null,
  URL: null,
  BUILT_IN: null,
});

exports.TAB = keyMirror({
  TESTS: null,
  REPORT: null,
  SETTINGS: null,
});

exports.SETTINGS_MENU = keyMirror({
  TESTS_SOURCE: null,
  TARGETS: null,
  HUBS: null,
});
