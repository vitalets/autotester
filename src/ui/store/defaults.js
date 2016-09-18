/**
 * Defaults for store to render before app loaded
 */

const {TABS, APP_STATE} = require('./constants');
const {TESTS_SOURCE_TYPES} = require('../../background/constants');

module.exports = {
  state: APP_STATE.INIT,
  tests: [],
  selectedTest: '',
  targets: [],
  selectedTarget: '',
  activeTabId: TABS.SOURCES,
  testsSourceType: TESTS_SOURCE_TYPES.SNIPPETS,
  testsSourceUrl: '',
};
