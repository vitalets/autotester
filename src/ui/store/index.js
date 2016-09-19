/**
 * This singleton store contains information about UI state
 */

const fields = require('./fields');
const Store = require('../../utils/mobx-store');

let store = null;

module.exports = {
  get store() {
    if (!store) {
      store = new Store(fields);
    }
    return store;
  }
};
