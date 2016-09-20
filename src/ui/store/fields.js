/**
 * Defaults for store to render before app loaded
 */

const {APP_STATE, TAB, TESTS_SOURCE_TYPE} = require('./constants');
const data = require('./data');

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
    defaultValue: data.targets,
    persistent: true,
  },
  selectedTarget: {
    defaultValue: 0,
    persistent: false,
  },
  hubs: {
    defaultValue: data.hubs,
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
  selectedTab: {
    defaultValue: TAB.SOURCES,
    persistent: false,
  },
  noQuit: {
    defaultValue: false,
    persistent: false,
  },
  error: {
    defaultValue: '',
    persistent: false,
  },
};
