/**
 * List of props fully describing ui state.
 * Default values are required to render layout before any communication
 * persistance flag defned whether to load/save prop in storage
 */

const {APP_STATE, TESTS_SOURCE_TYPE, SETTINGS_MENU} = require('./constants');

exports.runtime = {
  // todo: rename to appStatus
  appState: APP_STATE.LOADING,
  files: [],
  selectedTab: -1,
  stopOnError: false,
};

exports.persistent = {
  projects: [],
  selectedProjectId: '',
  targets: [],
  selectedTargetId: '',
  hubs: [],
  selectedSettingsMenuItem: SETTINGS_MENU.TESTS_SOURCE,
};

exports.computed = {
  get selectedProject() {
    return this.projects.find(project => project.id === this.selectedProjectId);
  },
  get testsSourceType() {
    return this.selectedProject.testsSource.type;
  },
  get selectedFile() {
    return this.selectedProject.selectedFile[this.testsSourceType] || '';
  },
  set selectedFile(value) {
    this.selectedProject.selectedFile[this.testsSourceType] = value;
  },
  get selectedTarget() {
    return this.targets.find(target => target.id === this.selectedTargetId);
  },
  get testsSourceUrl() {
    switch (this.testsSourceType) {
      case TESTS_SOURCE_TYPE.URL:
        return this.selectedProject.testsSource.url;
      case TESTS_SOURCE_TYPE.BUILT_IN:
        return chrome.runtime.getURL(this.selectedProject.testsSource.path);
      case TESTS_SOURCE_TYPE.SNIPPETS:
      default:
        return '';
    }
  }
};

exports.all = Object.assign(
  exports.computed,
  exports.runtime,
  exports.persistent
);


/*
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
*/
