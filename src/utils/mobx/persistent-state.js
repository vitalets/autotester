/**
 * State that can be stored in chrome.local.storage
 */

const mobx = require('mobx');
const thenChrome = require('then-chrome');
const State = require('./state');

module.exports = class PersistentState extends State {
  constructor(allFields, persistentFields) {
    super(allFields);
    this._loaded = false;
    this._persistentFields = persistentFields;
  }

  load() {
    const keys = Object.keys(this._persistentFields);
    return thenChrome.storage.local.get(keys)
      .then(mobx.action(data => {
        // console.info('LOADED', data);
        Object.assign(this, data);
        this._loaded = true;
        this._observePersistent();
      }));
  }

  isLoaded() {
    return this._loaded;
  }

  /**
   * Automatically save persistent fields to storage
   * @private
   */
  _observePersistent() {
    const keys = Object.keys(this._persistentFields);
    keys.forEach(fieldName => {
      // use here mobx.toJS as otherwise changes of deep objects/arrays are not tracked
      // see: https://jsfiddle.net/xd2zxu8u/5/
      mobx.reaction(() => mobx.toJS(this[fieldName]), newValue => {
        // console.info('SAVING', fieldName, newValue);
        const data = {
          [fieldName]: mobx.toJS(newValue)
        };
        thenChrome.storage.local.set(data);
      });
    });
  }
};
