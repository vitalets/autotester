/**
 * Catch all requests via chrome.webRequest
 *
 * Disadvantage:
 * Can not catch requests sent from extensions and apps.
 * http://stackoverflow.com/questions/37926493/is-it-possible-to-catch-requests-from-another-extension
 * https://bugs.chromium.org/p/chromium/issues/detail?id=510802#c37
 *
 * Advantage:
 * Can fake server response! (todo)
 *
 * Not used now.
 */

class WebRequestCatcher {
  constructor() {
    this._requests = [];
    this._started = false;
    this._handler = this._handler.bind(this);
  }
  /**
   *
   * @param {Object} target
   * @param {Number} target.tabId
   */
  setTarget(target) {
    this._target = target;
  }
  start() {
    this._requests.length = 0;
    if (!chrome.webRequest.onBeforeRequest.hasListener(this._handler)) {
      chrome.webRequest.onBeforeRequest.addListener(this._handler, {urls: ['<all_urls>']});
    }
  }
  stop() {
    chrome.webRequest.onBeforeRequest.removeListener(this._handler);
    return this._requests;
  }
  _handler(data) {
    if (data.tabId === this._target.tabId) {
      this._requests.push(data);
    }
  }
}
