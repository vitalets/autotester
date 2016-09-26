/**
 * Fake http module that translates requests to promises and sends response on promise resolve
 */

const Channel = require('chnl');

let handler = null;

/**
 * Http request
 * See: https://nodejs.org/api/http.html#http_http_request_options_callback
 *
 * @param {Object} opts
 * @param {Function} [callback]
 * @returns {Request}
 */
exports.request = function (opts, callback) {
  if (typeof handler !== 'function') {
    throw new Error('Fake request handler should be a function');
  }
  return new Request(opts, callback);
};

/**
 * Handler function for processing requests.
 * Handler may return promise.
 *
 * @param {Function} h
 */
exports.setHandler = function (h) {
  if (typeof h !== 'function') {
    throw new Error('Fake-http handler should be a funciton');
  } else {
    handler = h;
  }
};

/**
 * Implementation of request
 * See: https://nodejs.org/api/http.html#http_class_http_incomingmessage
 */
class Request extends Channel.EventEmitter {
  constructor(options, callback) {
    super();
    this._headers = {};
    this._options = options;
    this.body = [];
    this.uri = this._getUri();
    // extra fields
    this.isFake = true;
    this._callback = callback;
    this._finished = false;
  }

  write(chunk) {
    // todo: check chunk type and handle 'Buffer'
    if (chunk) {
      this.body.push(chunk);
    }
  }

  end(chunk) {
    if (chunk) {
      this.write(chunk);
    }
    const req = Object.assign({}, this._options, {body: this.body.join('')});
    Promise.resolve()
      .then(() => handler(req))
      .then(
        result => this._sendResponse(result),
        e => this._sendError(e)
      );
  }

  abort() {
    if (!this._finished) {
      this._finished = true;
      this.emit('abort');
    }
  }

  _sendResponse({data, statusCode}) {
    if (this._finished) {
      return;
    } else {
      this._finished = true;
    }
    const responseParams = {
      statusCode,
      data,
      method: this._options.method,
      url: this.uri,
    };
    const response = new Response(responseParams);
    this._callback(response);
    this.emit('response', response);
    // manually send response to emit all needed events
    response.send();
  }

  _getUri() {
    const {protocol, hostname, port, path} = this._options;
    return `${protocol}//${hostname}${port ? ':' + port : ''}${path}`;
  }

  _sendError(e) {
    this._sendResponse({
      statusCode: 500,
      data: e.message || String(e) || 'Internal fake-http server error',
    });
    return Promise.reject(e);
  }
}

/**
 * Implementation of response
 * See: https://nodejs.org/api/http.html#http_class_http_incomingmessage
 */
class Response extends Channel.EventEmitter {
  /**
   * Constructor
   *
   * @param {Object} params
   * @param {String} params.statusCode
   * @param {String} params.method
   * @param {String} params.url
   * @param {String} params.data
   */
  constructor (params = {}) {
    super();
    this.statusCode = params.statusCode || 200;
    this.headers = {};
    // extra fields
    this.isFake = true;
    this.data = params.data || '';
    this.method = params.method;
    this.url = params.url;
  }
  send() {
    if (this.data) {
      if (typeof this.data !== 'string') {
        throw new Error('Only string responses are supported in fake-http');
      }
      this.emit('data', this.data);
    }
    this.emit('end');
  }
}
