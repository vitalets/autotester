/**
 * This singleton store contains information about UI state
 */

// const Store = require('../../utils/mobx-store');
const State = require('./state');
const {TESTS_SOURCE_TYPE} = require('./constants');
const snippetTpl = require('raw!./snippet-tpl');

let state = null;

module.exports = {
  // todo: rename to state
  get store() {
    if (!state) {
      state = new State();
    }
    return state;
  }
};

/*
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
        const index = this.snippets.findIndex(snippet => snippet.id === this.selectedSnippet);
        if (index >= 0) {
          this.snippets.splice(index, 1);
          this.selectedSnippet = index > 0 ? this.snippets[index - 1].id : '';
        } else {
          this.selectedSnippet = '';
        }
      }
    })();
  }
  addSnippet() {
    mobx.action(() => {
      const id = `snippet-${Date.now()}`;
      const name = findFreeName(this.snippets);
      const code = snippetTpl.replace('{name}', name);
      const snippet = {id, name, code};
      this.snippets.push(snippet);
      this.selectedSnippet = snippet.id;
    })();
  }
}

function findFreeName(snippets) {
  for (let i=1; i < 99; i++) {
    const name = `new test ${i}`;
    if (!snippets.some(snippet => snippet.name === name)) {
      return name;
    }
  }
  return `new test`;
}
*/
