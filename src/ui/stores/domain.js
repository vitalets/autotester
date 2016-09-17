
const mobx = require('mobx');

module.exports = class Store {
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
