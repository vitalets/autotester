/**
 * Catch all requests via chrome.debugger
 *
 * Requires 2 flags to be enabled:
 * chrome://flags/#silent-debugger-extension-api
 * chrome://flags/#extensions-on-chrome-urls
 *
 * About warning: https://bugs.chromium.org/p/chromium/issues/detail?id=475151
 *
 * Target can be tab or extension
 * See: https://developer.chrome.com/extensions/debugger#type-Debuggee
 */


class DebuggerRequestCatcher extends BaseRequestCatcher {
  _attach() {
    return DebuggerRequestCatcher.promiseCall(chrome.debugger, 'attach', this._target, '1.1');
  }
  _start() {
    return this._sendCommand('Network.enable');
  }
  _stop() {
    return this._sendCommand('Network.disable');
  }
  _detach() {
    return DebuggerRequestCatcher.promiseCall(chrome.debugger, 'detach', this._target);
  }
  _handler(source, method, params) {
    if (!this._started || !this._isSameTarget(source)) {
      return;
    }
    if (method === 'Network.requestWillBeSent') {
      this._pushRequest(params.request);
    }
  }
  _isSameTarget(target) {
    return this._target && target
      && (this._target.tabId === target.tabId || this._target.extensionId === target.extensionId);
  }
  _alwaysListen() {
    chrome.debugger.onEvent.addListener(this._handler);
    chrome.debugger.onDetach.addListener(this._onDetach.bind(this));
  }
  _sendCommand(command) {
    return DebuggerRequestCatcher.promiseCall(chrome.debugger, 'sendCommand', this._target, command, {});
  }
  _onDetach(source, reason) {
    console.log('onDetach', source, reason);
    if (this._isSameTarget(source)) {
      this._attached = false;
      this._started = false;
    }
  }
  static promiseCall(obj, method) {
    const args = [].slice.call(arguments, 2);
    return new Promise((resolve, reject) => {
      args.push(res => chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(res));
      obj[method].apply(obj, args);
    });
  }
}


/*
class DebuggerRequestCatcher1 {
  constructor() {
    this._requests = [];
    this._target = null;
    this._attached = false;
    this._started = false;
    this._listenRequests();
    this._listenDetach();
  }
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
*/
