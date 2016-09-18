/**
 * Defaults for store to render before app loaded
 */

const {TAB, APP_STATE} = require('./constants');
const {TESTS_SOURCE_TYPE} = require('../../background/constants');

module.exports = {
  appState: APP_STATE.INIT,
  tests: [],
  selectedTest: '',
  targets: [],
  selectedTarget: '',
  activeTabId: TAB.SOURCES,
  testsSourceType: TESTS_SOURCE_TYPE.SNIPPETS,
  testsSourceUrl: '',
};
