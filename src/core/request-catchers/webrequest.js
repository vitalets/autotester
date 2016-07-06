/**
 * Catch all requests via chrome.webRequest
 *
 * Disadvantage:
 * Can not catch requests sent from extensions and apps.
 * http://stackoverflow.com/questions/37926493/is-it-possible-to-catch-requests-from-another-extension
 * https://bugs.chromium.org/p/chromium/issues/detail?id=510802#c37
 *
 * Advantage:
 * Can mock server response!
 */

class WebRequestCatcher extends BaseRequestCatcher {
  _start() {
    if (!chrome.webRequest.onBeforeRequest.hasListener(this._handler)) {
      chrome.webRequest.onBeforeRequest.addListener(this._handler, {urls: ['<all_urls>']});
    }
  }
  _stop() {
    chrome.webRequest.onBeforeRequest.removeListener(this._handler);
  }
  _handler(data) {
    if (this._isSameTarget({tabId: data.tabId})) {
      this._pushRequest(data);
    }
  }
  _isSameTarget(target) {
    return this._target && target && this._target.tabId === target.tabId;
  }
}
