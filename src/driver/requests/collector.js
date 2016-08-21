/**
 * Network request collector via debugger requestWillBeSent event.
 */

const Targets = require('../targets');
const Filter = require('./filter');
const logger = require('../../utils/logger').create('Requests collecctor');

const DEFAULT_REQUESTS_LIMIT = 1000;

class Collector {

  constructor() {
    this._requests = [];
    this._collecting = false;
    this._limit = DEFAULT_REQUESTS_LIMIT;
  }

  get collecting() {
    return this._collecting;
  }

  collect() {
    if (this._collecting) {
      throw new Error('Requests already in collecting state');
    }
    this._requests.length = 0;
    return Promise.resolve()
      .then(() => this._setNetworkState('enable'))
      .then(() => this._setEventListenerState('enable'))
      .then(() => {
        this._collecting = true;
        logger.log('start collecting');
      })
  }

  stop() {
    return Promise.resolve()
      .then(() => this._setNetworkState('disable'))
      .then(() => this._setEventListenerState('disable'))
      .then(() => {
        this._collecting = false;
        logger.log('stop collecting');
      })
  }

  /**
   * Returns catched requests passing filter
   *
   * @param {Object} filter
   */
  get(filter) {
    const requestFilter = new Filter(filter);
    const filtered = this._requests.filter(request => requestFilter.match(request));
    return Promise.resolve(filtered);
  }

  getCount(filter) {
    return this.get(filter).then(requests => requests.length);
  }

  dump(logging) {
    const result = this._requests.map(r => `${r.method} ${r.url}`);
    result.unshift(`Collected ${this._requests.length} requests:`);
    const resultStr = result.join('\n');
    if (logging) {
      logging.log(resultStr);
    }
    return Promise.resolve(resultStr);
  }

  setLimit(limit) {
    this._limit = limit;
  }

  _onEvent(method, params) {
    if (method === 'Network.requestWillBeSent' && this._collecting) {
      this._addRequest(params.request);
    }
  }

  _addRequest(request) {
    // todo: remove log
    logger.log('collected:', request.method, request.url);
    if (this._limit && this._requests.length >= this._limit) {
      this._requests.shift();
    }
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

module.exports = Collector;
