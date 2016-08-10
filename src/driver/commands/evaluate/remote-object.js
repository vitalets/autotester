/**
 * Wrapper around debugger RemoteObject result
 * Resolves useful value.
 */

const helper = require('./helper');

class RemoteObject {
  constructor(data) {
    this._data = data;
  }
  value() {
    return this._resolveByType();
  }
  _resolveByType() {
    switch (this._data.type) {
      case 'object':
        return this._resolveBySubtype();
      case 'function':
        return this._data.description;
      case 'undefined':
        return null;
      case 'string':
      case 'number':
      case 'boolean':
      default:
        return this._data.value;
    }
  }
  _resolveBySubtype() {
    switch (this._data.subtype) {
      case 'array':
        return this._resolveArray();
      case 'null':
        return null;
      case 'node':
        return this._resolveNode();
      case 'regexp':
        return this._resolveRegexp();
      case 'date':
        return this._resolveDate();
      case 'error':
        const ErrorConstructor = window[this._data.className] || Error;
        throw new ErrorConstructor('Async error in evaluated script: ' + this._data.description);
      default:
        return this._resolvePlainObject();
    }
  }
  _resolveArray() {
    return helper.getOwnProperties(this._data.objectId)
      .then(props => {
        const tasks = props
          // keep only props that are indexes
          .filter(prop => !Number.isNaN(Number(prop.name)))
          .map(prop => new RemoteObject(prop.value).value());
        return Promise.all(tasks);
      });
  }
  _resolveNode() {
    return helper.getWebElement(this._data.objectId);
  }
  _resolveRegexp() {
    throw new Error('_resolveRegexp not implemented');
  }
  _resolveDate() {
    throw new Error('_resolveDate not implemented');
  }
  _resolvePlainObject() {
    return helper.getOwnProperties(this._data.objectId)
      .then(props => {
        const tasks = props
          // keep only props that are enumerable (Object.keys())
          .filter(prop => prop.enumerable)
          .map(prop => new RemoteObject(prop.value).value());
        return Promise.all(tasks)
          .then(results => {
            return props.reduce((out, prop, index) => {
              out[prop.name] = results[index];
              return out;
            }, {});
          })
      });
  }
}

module.exports = RemoteObject;
