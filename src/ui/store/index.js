/**
 * This singleton store contains information about UI state
 */

const mobx = require('mobx');
const defaults = require('./defaults');

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
  return mobx.observable(defaults);
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
