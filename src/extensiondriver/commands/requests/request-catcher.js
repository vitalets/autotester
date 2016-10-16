/**
 * Catch network requests via debugger requestWillBeSent event and notify listeners.
 */

const Channel = require('chnl');
const Targets = require('../../targets');

class RequestCatcher {

  constructor() {
    this.onCatched = new Channel();
    this._debugger = null;
  }

  start() {
    this._debugger = Targets.debugger;
    this._listeners = new Channel.Subscription([
      {
        channel: this._debugger.onEvent,
        listener: this._onDebuggerEvent.bind(this)
      }
    ]);
    return this._setNetworkState('enable')
      .then(() => this._listeners.on())
  }

  stop() {
    if (!this._debugger) {
      throw new Error('RequestCatcher already stopped');
    }
    this._listeners.off();
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
