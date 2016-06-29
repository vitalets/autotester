/**
 * Catch all requests via devtools.network
 * Works only for tab with opened devtools
 */

class DevtoolsRequestCatcher {
  constructor() {
    this._requests = [];
    this._enabled = false;
    this._listen();
  }
  start() {
    this._requests.length = 0;
    this._enabled = true;
  }
  stop() {
    this._enabled = false;
    return this.requests;
  }
  get requests() {
    return this._requests.slice();
  }
  _listen() {
    chrome.devtools.network.onRequestFinished.addListener(data => {
      if (this._enabled) {
        this._requests.push(data.request);
      }
    });
  }
}
