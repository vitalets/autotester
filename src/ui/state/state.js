/**
 * Current App UI state
 */

const mobx = require('mobx');
const PersistentState = require('../../utils/mobx/persistent-state');
const fields = require('./state-fields');
// const innerFileTpl = require('raw!./inner-file-tpl');

module.exports = class State extends PersistentState {
  constructor() {
    super(fields.all, fields.persistent);
    this.deleteSnippet = mobx.action(this.deleteSnippet.bind(this));
    this.addSnippet = mobx.action(this.addSnippet.bind(this));
    mobx.reaction(() => mobx.toJS(this.files), mobx.action(this._verifySelectedFile.bind(this)));
  }

  // clearTests() {
  //   this.reset(['tests', 'testsSetup', 'selectedTest']);
  // }

  deleteSnippet() {
    if (this.isSnippets && this.selectedFile) {
      const index = this.snippets.findIndex(snippet => snippet.path === this.selectedFile);
      if (index >= 0) {
        this.snippets.splice(index, 1);
        this.selectedFile = index > 0 ? this.snippets[index - 1].path : '';
      } else {
        this.selectedFile = '';
      }
    }
  }

  addSnippet() {
    const path = findFreeName(this.snippets);
    // todo: save code to fs
    // const code = snippetTpl.replace('{name}', name);
    const snippet = {path};
    this.snippets.push(snippet);
    this.selectedFile = snippet.path;
  }

  /**
   * Automatically reset selected file if it is not found in current files
   * @private
   */
  _verifySelectedFile() {
    if (this.selectedFile && !this.files.find(file => file.path === this.selectedFile)) {
      this.selectedFile = '';
    }
  }
};

// todo: move to utils
function findFreeName(snippets) {
  for (let i = 1; i < 99; i++) {
    const name = `new_file_${i}`;
    if (!snippets.some(snippet => snippet.path === name)) {
      return name;
    }
  }
  return `new_file`;
}
