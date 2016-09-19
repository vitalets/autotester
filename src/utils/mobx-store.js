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
    this._setSaveReactions();
  }

  /**
   * Loads persistent data
   */
  load() {
    return thenChrome.storage.local.get(this._persistentFields)
      .then(mobx.action(data => {
        console.info('mobx-store: loaded', data);
        Object.assign(this, data);
      }))
      .then(() => this._loaded = true);
  }

  _setSaveReactions() {
    // automatically save persistent fields to storage
    this._persistentFields.forEach(fieldName => {
      mobx.observe(this, fieldName, newValue => this._save(fieldName, newValue));
    });
  }

  _save(fieldName, newValue) {
    if (this._loaded) {
      const data = {
        [fieldName]: mobx.toJS(newValue)
      };
      console.info('mobx-store: saving', data);
      return thenChrome.storage.local.set(data);
    }
  }

  _getPersistentFields() {
    return Object.keys(this._fields).filter(fieldName => this._fields[fieldName].persistent);
  }

  _getObservableObj() {
    return Object.keys(this._fields).reduce((res, fieldName) => {
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
