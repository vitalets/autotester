/**
 * Simple mobx state
 */

const mobx = require('mobx');

module.exports = class State {
  constructor(fields) {
    this._fields = fields;
    mobx.extendObservable(this, fields);
    this.reset = mobx.action(this.reset.bind(this));
  }
  reset(fields = []) {
    fields.forEach(fieldName => {
      this[fieldName] = this._fields[fieldName];
    });
  }
};
