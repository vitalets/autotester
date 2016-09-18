/**
 * This singleton store contains information about UI state
 */

const fields = require('./fields');
const Store = require('./store');

let store = null;

module.exports = {
  get store() {
    if (!store) {
      store = new Store(fields);
    }
    return store;
  }
};


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
