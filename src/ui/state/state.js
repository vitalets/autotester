/**
 * Current App UI state
 */

const mobx = require('mobx');
const PersistentState = require('../../utils/mobx/persistent-state');
const fields = require('./state-fields');
const innerFileTpl = require('raw!./inner-file-tpl');
const localFs = require('../../utils/local-fs');

module.exports = class State extends PersistentState {
  constructor() {
    super(fields.all, fields.persistent);
    this.deleteInnerFile = mobx.action(this.deleteInnerFile.bind(this));
    this.addInnerFile = mobx.action(this.addInnerFile.bind(this));
    mobx.reaction(() => mobx.toJS(this.files), mobx.action(this._verifySelectedFile.bind(this)));
  }

  // clearTests() {
  //   this.reset(['tests', 'testsSetup', 'selectedTest']);
  // }

  deleteInnerFile() {
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

  addInnerFile() {
    const name = findFreeName(this.files);
    const file = {path: name};
    this.files.push(file);
    this.selectedFile = name;
    const fullPath = `${this.innerFilesPath}/${name}`;
    const code = innerFileTpl.replace('{name}', name);
    localFs.save(fullPath, code);
  }

  /**
   * Verify that selected file is found in current files
   */
  _verifySelectedFile() {
    if (this.selectedFile && this.files.length && !this.files.find(file => file.path === this.selectedFile)) {
      this.selectedFile = '';
    }
  }
};

// todo: move to utils
function findFreeName(files) {
  for (let i = 1; i < 99; i++) {
    const name = `new_file_${i}`;
    if (!files.some(file => file.path === name)) {
      return name;
    }
  }
  return `new_file`;
}
