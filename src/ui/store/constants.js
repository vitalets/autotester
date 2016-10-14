
const keyMirror = require('keymirror');

exports.APP_STATE = keyMirror({
  LOADING: null,
  READY: null,
  TESTS_RUNNING: null,
  TESTS_DONE: null,
});

// dont use keyMirror here as these values stored on client side
exports.TESTS_SOURCE_TYPE = {
  SNIPPETS: 'SNIPPETS',
  URL: 'URL',
  BUILT_IN: 'BUILT_IN',
};

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
