
const keyMirror = require('keymirror');

exports.APP_STATE = keyMirror({
  INIT: null,
  READY: null,
  TESTS_RUNNING: null,
  TESTS_DONE: null,
});

exports.TESTS_SOURCE_TYPE = keyMirror({
  SNIPPETS: null,
  URL: null,
  EMBEDED: null,
});

exports.TAB = keyMirror({
  SOURCES: null,
  REPORT: null,
  SETTINGS: null,
});

