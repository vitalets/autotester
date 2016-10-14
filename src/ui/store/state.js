/**
 * Current App UI state
 */

const mobx = require('mobx');
const fields = require('./fields');

const {APP_STATE, SETTINGS_MENU} = require('./constants');



module.exports = class State {
  constructor() {
    mobx.extendObservable(this, fields.all);
  }

  load() {
    const keys = Object.keys(fields.persistentFields);
    return thenChrome.storage.local.get(keys)
      .then(mobx.action(data => {
        console.info('State: loaded', data);
        Object.assign(this, data);
        this._observePersistent();
      }));
  }

  /**
   * Automatically save persistent fields to storage
   * @private
   */
  _observePersistent() {
    const keys = Object.keys(fields.persistentFields);
    keys.forEach(fieldName => {
      // use here mobx.toJS as otherwise changes of deep objects/arrays are not tracked
      // see: https://jsfiddle.net/xd2zxu8u/5/
      mobx.reaction(() => mobx.toJS(this[fieldName]), newValue => {
        // console.info('CHANGED', fieldName, newValue)
        const data = {
          [fieldName]: mobx.toJS(newValue)
        };
        thenChrome.storage.local.set(data);
      });
    });
  }

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
};
