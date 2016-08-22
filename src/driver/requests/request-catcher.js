/**
 * Catch network requests via debugger requestWillBeSent event and notify listeners.
 */

const utils = require('../../utils');
const Channel = require('chnl');
const Targets = require('../targets');
const logger = require('../../utils/logger').create('Request catcher');

class RequestCatcher {

  constructor() {
    this.onCatched = new Channel();
    this._debugger = null;
    this._onDebuggerEvent = this._onDebuggerEvent.bind(this);
  }

  start() {
    this._debugger = Targets.debugger;
    return this._setNetworkState('enable')
      .then(() => this._manageListeners('set'))
  }

  stop() {
    this._manageListeners('unset');
    return this._setNetworkState('disable')
      .then(() => this._debugger = null)
  }

  _manageListeners(action) {
    utils.manageListener(this._debugger.onEvent, this._onDebuggerEvent, action);
  }

  _setNetworkState(state) {
    return this._debugger.sendCommand(`Network.${state}`);
  }

  _onDebuggerEvent(method, params) {
    if (method === 'Network.requestWillBeSent') {
      this.onCatched.dispatch(params);
    }
  }
}

module.exports = RequestCatcher;
