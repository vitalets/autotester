/**
 * Current App UI state
 */

const mobx = require('mobx');
const PersistentState = require('../../utils/mobx/persistent-state');
const fields = require('./state-fields');

module.exports = class State extends PersistentState {
  constructor() {
    super(fields.all, fields.persistent);
    // todo: mobx.toJS -> mobx.asStructure
    mobx.reaction(() => mobx.toJS(this.files), mobx.action(this._verifySelectedFile.bind(this)));
  }

  /**
   * On every change of files check that selectedFile is found there and reset if not found
   */
  _verifySelectedFile() {
    if (this.selectedFile && this.files.length && !this.files.find(file => file.path === this.selectedFile)) {
      this.selectedFile = '';
    }
  }
};
