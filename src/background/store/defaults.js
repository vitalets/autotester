/**
 * Defaults for store
 */

//const {TAB, APP_STATE} = require('./constants');
//const {TESTS_SOURCE_TYPE} = require('../../background/constants');

/*
module.exports = {
  appState: APP_STATE.INIT,
  tests: [],
  selectedTest: '',
  targets: [],
  selectedTarget: '',
  testsSourceType: TESTS_SOURCE_TYPE.SNIPPETS,
  testsSourceUrl: '',
};
*/

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
  }
};
