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
        console.info('loaded', data);
        Object.assign(this, data);
      }))
      .then(() => this._loaded = true);
  }

  _setSaveReactions() {
    this._persistentFields.forEach(fieldName => {
      mobx.autorun(() => this._save(fieldName));
    });
    // todo: use single function for each field
    // todo: using autorunAsync causes save right after load
    // mobx.autorunAsync(() => this._save(), 200);
  }

  _save(fieldName) {
    const data = {
      [fieldName]: mobx.toJS(this[fieldName])
    };
    if (this._loaded) {
      console.info('saving', data);
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
