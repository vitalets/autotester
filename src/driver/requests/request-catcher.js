/**
 * Catch network requests via debugger requestWillBeSent event and notify listeners.
 */

const ListenerSwitch = require('../../utils/listener-switch');
const Channel = require('chnl');
const Targets = require('../targets');
const logger = require('../../utils/logger').create('Request catcher');

class RequestCatcher {

  constructor() {
    this.onCatched = new Channel();
    this._debugger = null;
  }

  start() {
    this._debugger = Targets.debugger;
    this._listenerSwitch = new ListenerSwitch([
      [this._debugger.onEvent, this._onDebuggerEvent]
    ], this);
    return this._setNetworkState('enable')
      .then(() => this._listenerSwitch.on())
  }

  stop() {
    if (!this._debugger) {
      throw new Error('RequestCatcher already stopped');
    }
    this._listenerSwitch.off();
    return this._setNetworkState('disable')
      .then(() => this._debugger = null)
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
