/**
 * Network request catcher
 */

const Targets = require('../targets');
const Filter = require('./filter');
const logger = require('../../utils/logger').create('Requests');

class Requests {

  constructor(driver) {
    this._driver = driver;
    this._requests = [];
    this._collecting = false;
  }

  catch() {
    throw new Error('.catch() was renamed to .collect()');
  }

  collect() {
    if (this._collecting) {
      throw new Error('Requests already in collecting state');
    }
    this._requests.length = 0;
    return this._queue(() => this._collect());
  }

  stop() {
    return this._queue(() => this._stop());
  }

  /**
   * Returns catched requests passing filter
   *
   * @param {Object} filter
   */
  get(filter) {
    return this._queue(() => {
      const requestFilter = new Filter(filter);
      const filtered = this._requests.filter(request => requestFilter.match(request));
      return Promise.resolve(filtered);
    });
  }

  getCount(filter) {
    return this.get(filter).then(requests => requests.length);
  }

  dump(console) {
    return this._queue(() => {
      const result = this._requests.map(r => `${r.method} ${r.url}`);
      result.unshift(`Catched ${this._requests.length} requests:`);
      const resultStr = result.join('\n');
      if (console) {
        console.log(resultStr);
      }
      return Promise.resolve(resultStr);
    });
  }

  _collect() {
    return Promise.resolve()
      .then(() => this._setNetworkState('enable'))
      .then(() => this._setEventListenerState('enable'))
      .then(() => {
        this._collecting = true;
        logger.log('start collecting');
      })
  }

  _stop() {
    return Promise.resolve()
      .then(() => this._setNetworkState('disable'))
      .then(() => this._setEventListenerState('disable'))
      .then(() => {
        this._collecting = false;
        logger.log('stop collecting');
      })
  }

  _queue(fn) {
    return this._driver.controlFlow().execute(fn);
  }

  _onEvent(method, params) {
    if (method === 'Network.requestWillBeSent') {
      this._addRequest(params.request);
    }
  }

  _addRequest(request) {
    logger.log('catched', request);
    this._requests.push(request);
  }

  /**
   *
   * @param {String} state 'enable|disable'
   */
  _setNetworkState(state) {
    return Targets.debugger.sendCommand(`Network.${state}`);
  }

  /**
   *
   * @param {String} state 'enable|disable'
   */
  _setEventListenerState(state) {
    const method = state === 'enable' ? 'addListener' : 'removeListener';
    return Targets.debugger.onEvent[method](this._onEvent, this);
  }
}

module.exports = Requests;
