/**
 * List of props fully describing ui state.
 * Default values are required to render layout before any communication
 * persistance flag defned whether to load/save prop in storage
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
  snippets: {
    defaultValue: [],
    // todo: save snippets code separately
    persistent: true,
  },
  selectedSnippet: {
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
    defaultValue: TAB.TESTS,
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
