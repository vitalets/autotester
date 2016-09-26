/**
 * Mobx store that can load/save data to chrome.storage.local
 */

const thenChrome = require('then-chrome');
const mobx = require('mobx');

module.exports = class Store {
  constructor(fields) {
    this._fields = fields;
    this._loaded = false;
    this._persistentFields = this._getPersistentFields();
    const obj = this._getObservableObj();
    mobx.extendObservable(this, obj);
    this._observePersistent();
  }

  /**
   * Loads persistent data
   */
  load() {
    return thenChrome.storage.local.get(this._persistentFields)
      .then(mobx.action(data => {
        // console.info('mobx-store: loaded', data);
        Object.assign(this, data);
        //mobx.extendObservable(this, data);
        // Object.keys(data).forEach(key => {
        //   if (Array.isArray(this[key].slice())) {
        //     this[key].clear();
        //     if (Array.isArray(data[key])) {
        //       data[key].forEach(item => this[key].push(item));
        //     }
        //   } else {
        //     this[key] = data[key];
        //   }
        // });
      }))
      .then(() => this._loaded = true);
  }

  reset(fieldNames = []) {
    mobx.action(() => {
      fieldNames.forEach(fieldName => {
        this[fieldName] = this._fields[fieldName].defaultValue;
      });
    })();
  }

  _observePersistent() {
    // automatically save persistent fields to storage
    this._persistentFields.forEach(fieldName => {
      // use here mobx.toJS as otherwise changes of deep objects/arrays are not tracked
      // see: https://jsfiddle.net/xd2zxu8u/5/
      mobx.reaction(() => mobx.toJS(this[fieldName]), newValue => {
        // console.info('CHANGED', fieldName, newValue)
        this._save(fieldName, newValue);
      });
    });
  }

  _save(fieldName, newValue) {
    if (this._loaded) {
      const data = {
        [fieldName]: mobx.toJS(newValue)
      };
      // console.info('mobx-store: saving', data);
      return thenChrome.storage.local.set(data);
    }
  }

  _getPersistentFields() {
    return Object.keys(this._fields).filter(fieldName => this._fields[fieldName].persistent);
  }

  _getObservableObj() {
    return Object.keys(this._fields).reduce((res, fieldName) => {
      if (fieldName in this) {
        throw new Error(`Field ${fieldName} already in mobx-store`);
      }
      res[fieldName] = this._fields[fieldName].defaultValue;
      return res;
    }, {});
  }
};

/*
 function sync(field) {
 chrome.runtime.sendMessage({
 type: 'sync',
 field: field,
 value: value,
 });
 }

 function listen() {
 chrome.runtime.onMessage.addListener(data => {
 if (data.type === 'sync') {
 action(() => store[data.field] = data.value)();
 }
 });
 }
 */
