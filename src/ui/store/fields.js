/**
 * Defaults for store to render before app loaded
 */

const {TAB, APP_STATE} = require('./constants');
const {TESTS_SOURCE_TYPE} = require('../../background/constants');

module.exports = {
  appState: {
    defaultValue: APP_STATE.INIT,
    persistent: false,
  },
  tests: {
    defaultValue: [],
    persistent: false,
  },
  selectedTest: {
    defaultValue: '',
    persistent: true,
  },
  targets: {
    defaultValue: [],
    persistent: true,
  },
  selectedTarget: {
    defaultValue: '',
    persistent: true,
  },
  selectedTab: {
    defaultValue: TAB.SOURCES,
    persistent: true,
  },
  testsSourceType: {
    defaultValue: TESTS_SOURCE_TYPE.SNIPPETS,
    persistent: true,
  },
  testsSourceUrl: {
    defaultValue: '',
    persistent: true,
  },
  error: {
    defaultValue: '',
    persistent: false,
  },
};
