/**
 * Alias for require('http') that uses real http or fake-http modules and dispatches events.
 */

const Channel = require('chnl');
const httpBrowserify = require('http-browserify');
const httpsBrowserify = require('https-browserify');
const fakeHttp = require('../utils/fake-http');

const LOOPBACK_HOST = 'autotester';

// intercept for event dispatching
const realHttpWrapped = intercept(httpBrowserify);
const realHttpsWrapped = intercept(httpsBrowserify);
const fakeHttpWrapped = intercept(fakeHttp);

exports.request = function (opts) {
  const http = opts.hostname === LOOPBACK_HOST
    ? fakeHttpWrapped
    : (opts.protocol === 'https:' ? realHttpsWrapped : realHttpWrapped);
  return http.request.apply(http, arguments);
};

exports.onRequest = new Channel();
exports.onRequestData = new Channel();
exports.onResponse = new Channel();

function intercept(http) {
  const origRequest = http.request;
  http.request = function (options) {
    const request = origRequest.apply(http, arguments);
    exports.onRequest.dispatchAsync({request, options});
    request.on('response', response => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => {
        exports.onResponse.dispatchAsync({request, options, response, data: chunks.join('')});
      });
    });

    const origWrite = request.write;
    request.write = function (data) {
      exports.onRequestData.dispatchAsync({request, data});
      return origWrite.apply(request, arguments);
    };

    return request;
  };
  return http;
}
