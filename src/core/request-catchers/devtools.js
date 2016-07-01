/**
 * Catch all requests via devtools.network
 * Works only for tab with opened devtools
 */

class DevtoolsRequestCatcher {
  constructor() {
    this._requests = [];
    this._started = false;
    this._handler = this._handler.bind(this);
    // start listen here as onRequestFinished does not have removeListener
    this._listen();
  }
  start() {
    this._requests.length = 0;
    this._started = true;
  }
  stop() {
    this._started = false;
    return this._requests;
  }
  _listen() {
    chrome.devtools.network.onRequestFinished.addListener(this._handler);
  }
  _handler(data) {
    if (this._started && this._passFilter(data.request)) {
      this._requests.push(data.request);
    }
  }
  _passFilter(request) {
    return !/^data\:/.test(request.url);
  }
}
