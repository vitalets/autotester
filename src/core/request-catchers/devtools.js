/**
 * Catch all requests via devtools.network
 * Works only for tab with opened devtools
 */

class DevtoolsRequestCatcher extends BaseRequestCatcher {
  _alwaysListen() {
    chrome.devtools.network.onRequestFinished.addListener(this._handler);
  }
  _handler(data) {
    if (this._started) {
      this._pushRequest(data.request);
    }
  }
  _isSameTarget() {
    return true;
  }
}
