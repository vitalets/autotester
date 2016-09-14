/**
 * Fake http module that translates requests to promises and sends response on promise resolve
 */

const Channel = require('chnl');
const utils = require('.');

const RESPONSE_DEFAULTS = {
  statusCode: 200,
  headers: [],
};

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
    throw new Error('Fake request handler shoulb be a function');
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
  handler = h;
};

/**
 * Implementation of request
 * See: https://nodejs.org/api/http.html#http_class_http_incomingmessage
 */
class Request extends Channel.EventEmitter {
  constructor(options, callback) {
    super();
    this._options = options;
    this._callback = callback;
    this._body = undefined;
    this._finished = false;
  }

  write(chunk) {
    // todo: check chunk type and porcess Buffer
    if (chunk) {
      if (this._body === undefined) {
        this._body = '';
      }
      this._body += chunk;
    }
  }

  end(chunk) {
    if (chunk) {
      this.write(chunk);
    }
    const req = Object.assign({}, this._options, {body: this._body});
    Promise.resolve()
      .then(() => handler(req))
      .then(
        data => this._sendResponse(data),
        e => this._sendError(e)
      );
  }

  abort() {
    if (!this._finished) {
      this._finished = true;
      this.emit('abort');
    }
  }

  _sendResponse(data, statusCode) {
    if (this._finished) {
      return;
    } else {
      this._finished = true;
    }
    const responseParams = this._getResponseParams(data, statusCode);
    const response = new Response(responseParams);
    this._callback(response);
    this.emit('response', response);
    // manually send response to emit all needed events
    response.send();
  }

  _getUrl() {
    const {protocol, hostname, port, path} = this._options;
    return `${protocol}//${hostname}${port ? ':' + port : ''}${path}`;
  }

  _getResponseParams(data, statusCode) {
    const responseParams = {
      method: this._options.method,
      url: this._getUrl(),
    };
    if (data !== undefined) {
      responseParams.data = data;
    }
    if (statusCode !== undefined) {
      responseParams.statusCode = statusCode;
    }
    return responseParams;
  }

  _sendError(e) {
    this._sendResponse(e.message || String(e), 500);
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
    Object.assign(this, RESPONSE_DEFAULTS, params);
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
