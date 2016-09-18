
const keyMirror = require('keymirror');

exports.TAB = keyMirror({
  SOURCES: null,
  REPORT: null,
  SETTINGS: null,
});

exports.APP_STATE = keyMirror({
  INIT: null,
  READY: null,
  BUSY: null,
  TESTS_RUNNING: null,
  TESTS_FINISHED: null,
});
