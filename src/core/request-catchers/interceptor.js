/**
 * Catch all requests via intercepting `window.fetch` and `window.XMLHttpRequest`
 * It's unconvinient because we need re-attach it on page reload and can miss some requests.
 *
 * Not used now.
 */

class RequestInterceptor {
  /**
   * Constructor
   */
  constructor() {
    this._requests = [];
    this._pendingRequests = new Map();
    this._enabled = false;
  }

  /**
   * @param {Object} win
   */
  attach(win) {
    this._interceptFetch(win);
    this._interceptXhr(win);
  }

  start() {
    this._requests.length = 0;
    this._pendingRequests.clear();
    this._enabled = true;
  }

  stop() {
    this._enabled = false;
    return this.requests;
  }

  get requests() {
    return this._requests.slice();
  }

  _handler(method, url, body) {
    method = method.toUpperCase();
    this._requests.push({method, url, body});
    console.log('intercepted11', method, url, body);
  }

  _interceptFetch(win) {
    const self = this;
    this._intercept(win, 'fetch', function (url, options = {}) {
      if (self._enabled) {
        self._handler(options.method || 'get', url, options.body);
      }
    });
  }

  _interceptXhr(win) {
    const self = this;
    this._intercept(win.XMLHttpRequest.prototype, 'open', function (method, url) {
      if (self._enabled) {
        self._pendingRequests.set(this, {method, url});
      }
    });
    this._intercept(win.XMLHttpRequest.prototype, 'send', function (body) {
      const req = self._pendingRequests.get(this);
      if (self._enabled && req) {
        self._handler(req.method, req.url, body);
      }
    });
  }

  _intercept(obj, method, interceptor) {
    const old = obj[method];
    obj[method] = function () {
      const res = old.apply(this, arguments);
      interceptor.apply(this, arguments);
      return res;
    };
  }
}
