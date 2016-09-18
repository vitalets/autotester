/**
 * This singleton store contains information about UI state
 */

const mobx = require('mobx');
const uiConstants = require('./constants');
const bgConstants = require('../../background/constants');

const {TABS} = uiConstants;
const {TESTS_SOURCE_TYPES} = bgConstants;

const initialData = {
  activeTabId: TABS.SOURCES,
  tests: [],
  selectedTest: '',
  targets: [],
  selectedTarget: '',
  testsSourceType: TESTS_SOURCE_TYPES.SNIPPETS,
  testsSourceUrl: '',
};

let store = null;

module.exports = {
  get store() {
    if (!store) {
      store = createStore();
    }
    return store;
  }
};

function createStore() {
  return mobx.observable(initialData);
}


/*
  class UIStore {
    constructor() {
      mobx.extendObservable(this, {
        a: 1,
        get computedA() {
          console.log('computed');
          return this.a + 1;
        },
        print: mobx.action(function () {
          console.log('action', this.a)
        })
      });
      mobx.autorun(() => console.info('autorun', this.a));
    }
  };
*/
