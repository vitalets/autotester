/**
 * List of props fully describing ui state.
 * Default values are required to render layout before any communication
 * persistance flag defned whether to load/save prop in storage
 */

const {APP_STATE, SETTINGS_MENU} = require('./constants');

module.exports = {
  appState: {
    defaultValue: APP_STATE.LOADING,
    persistent: false,
  },
  projects: {
    defaultValue: [],
    persistent: true,
  },
  selectedProjectId: {
    defaultValue: '',
    persistent: true,
  },
  tests: {
    defaultValue: [],
    persistent: false,
  },
  selectedTest: {
    defaultValue: '',
    persistent: false,
  },
  targets: {
    defaultValue: [],
    persistent: true,
  },
  selectedTarget: {
    defaultValue: 0,
    persistent: false,
  },
  hubs: {
    defaultValue: [],
    persistent: true,
  },
  // testsSourceBuiltInPath: {
  //   defaultValue: chrome.runtime.getURL('/tests/index.js'),
    defaultValue: buildInfo.isDev ? TESTS_SOURCE_TYPE.BUILT_IN : TESTS_SOURCE_TYPE.SNIPPETS,
  // },
  selectedTab: {
    defaultValue: -1, // better set -1 to avoid flushing content on start,
    persistent: false,
  },
  selectedSettingsMenuItem: {
    defaultValue: SETTINGS_MENU.TESTS_SOURCE,
    persistent: true,
  },
  stopOnError: {
    defaultValue: false,
    persistent: false,
  },
};
