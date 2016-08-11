/**
 * Network request catcher
 *
 * To catch requests from extensions you should enable 2 flags:
 * chrome://flags/#silent-debugger-extension-api
 * chrome://flags/#extensions-on-chrome-urls
 *
 * About warning: https://bugs.chromium.org/p/chromium/issues/detail?id=475151
 *
 */

const TargetManager = require('./target-manager');
const RequestsFilter = require('./requests-filter');
const logger = require('./logger').create('Requests');

class Requests {

  constructor(driver) {
    this._driver = driver;
    this._requests = [];
  }

  catch() {
    this._requests.length = 0;
    return this._driver.controlFlow().execute(() => {
      return Promise.resolve()
        .then(() => this._setNetworkState('enable'))
        .then(() => this._setEventListenerState('enable'))
        .then(() => logger.log('start catching'))
    });
  }

  stop() {
    return this._driver.controlFlow().execute(() => {
      return Promise.resolve()
        .then(() => this._setNetworkState('disable'))
        .then(() => this._setEventListenerState('disable'))
        .then(() => logger.log('stop catching'))
    });
  }

  /**
   * Returns catched requests passing filter
   *
   * @param {Object} filter
   */
  get(filter) {
    const requestFilter = new RequestsFilter(filter);
    const filtered = this._requests.filter(request => requestFilter.match(request));
    return Promise.resolve(filtered);
  }

  getCount(filter) {
    return this.get(filter).then(requests => requests.length);
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
    return TargetManager.debugger.sendCommand(`Network.${state}`);
  }

  /**
   *
   * @param {String} state 'enable|disable'
   */
  _setEventListenerState(state) {
    const method = state === 'enable' ? 'addListener' : 'removeListener';
    return TargetManager.debugger.onEvent[method](this._onEvent, this);
  }
}

module.exports = Requests;
