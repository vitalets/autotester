/**
 * This singleton store contains information about UI state
 */

const mobx = require('mobx');
const fields = require('./fields');
const Store = require('../../utils/mobx-store');
const {TESTS_SOURCE_TYPE} = require('./constants');

let store = null;

module.exports = {
  get store() {
    if (!store) {
      store = new MyStore(fields);
    }
    return store;
  }
};

class MyStore extends Store {
  isSnippets() {
    return this.testsSourceType === TESTS_SOURCE_TYPE.SNIPPETS;
  }
  getTestsUrl() {
    return this.testsSourceType === TESTS_SOURCE_TYPE.URL
      ? this.testsSourceUrl
      : this.testsSourceBuiltInPath;
  }
  clearTests() {
    this.reset(['tests', 'testsSetup', 'selectedTest']);
  }
  deleteSelectedSnippet() {
    mobx.action(() => {
      if (this.selectedSnippet) {
        this.snippets = this.snippets.filter(snippet => snippet.id !== this.selectedSnippet);
        this.selectedSnippet = '';
      }
    })();
  }
}
