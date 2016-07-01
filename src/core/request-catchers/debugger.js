/**
 * Catch all requests via chrome.debugger
 *
 * Requires 2 flags to be enabled:
 * chrome://flags/#silent-debugger-extension-api
 * chrome://flags/#extensions-on-chrome-urls
 *
 * About warning: https://bugs.chromium.org/p/chromium/issues/detail?id=475151
 */

class DebuggerRequestCatcher {
  constructor() {
    this._requests = [];
    this._target = null;
    this._attached = false;
    this._started = false;
    this._listenRequests();
    this._listenDetach();
  }
  /**
   * See: https://developer.chrome.com/extensions/debugger#type-Debuggee
   * @param {Object} target
   * @param {Object} target.extensionId
   */
  setTarget(target) {
    if (this._attached && this._target.extensionId !== target.extensionId) {
      // todo: return Promise?
      chrome.debugger.detach(this._target);
    }
    this._target = target;
  }
  start() {
    this._requests.length = 0;
    const res = this._attached ? Promise.resolve() : this._attach();
    return res
      .then(() => this._sendCommand('Network.enable'))
      .then(() => this._started = true);
  }
  stop() {
    this._started = false;
    this._sendCommand('Network.disable');
    return this._requests;
  }
  _attach() {
    if (!this._target) {
      throw new Error('You should provide debugger target!');
    }
    return new Promise((resolve, reject) => {
      chrome.debugger.attach(this._target, '1.1', () => {
        if (chrome.runtime.lastError) {
          this._attached = false;
          reject(chrome.runtime.lastError);
        } else {
          this._attached = true;
          resolve();
        }
      })
    });
  }
  _sendCommand(command) {
    return new Promise((resolve, reject) => {
      chrome.debugger.sendCommand(this._target, command, {}, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }
  _listenRequests() {
    chrome.debugger.onEvent.addListener((source, method, params) => {
      if (!this._started) {
        return;
      }
      if (!this._isMyEvent(source)) {
        return;
      }
      if (method === 'Network.requestWillBeSent' && this._passFilter(params.request)) {
        this._requests.push(params.request);
      }
    });
  }
  _listenDetach() {
    chrome.debugger.onDetach.addListener((source, reason) => {
      // console.log('onDetach', source, reason);
      if (this._isMyEvent(source)) {
        this._attached = false;
        this._started = false;
      }
    });
  }
  _isMyEvent(source) {
    return this._target && this._target.extensionId === source.extensionId;
  }
  _passFilter(request) {
    return !/^data\:/.test(request.url);
  }
}
