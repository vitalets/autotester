/**
 * External events.
 * This file should be included in both bg and tab contexts.
 */

const keyMirror = require('keymirror');

/**
 * List of all messages
 */
module.exports = keyMirror({
  // from tab
  TESTS_LIST_LOAD: null,
  TESTS_RUN: null,
  // from bg
  RELOAD: null,
  TESTS_DONE: null,
  SESSION_STARTED: null,
});
