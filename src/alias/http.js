/**
 * Alias for require('http') that uses real http or fake-http modules and dispatches events.
 */

const Channel = require('chnl');
const logger = require('../utils/logger').create('Http');
const httpBrowserify = require('webpack/node_modules/node-libs-browser/node_modules/http-browserify');
const httpsBrowserify = require('webpack/node_modules/node-libs-browser/node_modules/https-browserify');
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
  http.request = function (options, callback) {
    const request = origRequest.apply(http, arguments);
    // todo: dispatch async everywhere, to not break flow
    exports.onRequest.dispatch({request, options});
    request.on('response', response => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => {
        exports.onResponse.dispatch({request, options, response, data: chunks.join('')});
      });
    });

    const origWrite = request.write;
    request.write = function (data) {
      exports.onRequestData.dispatch({request, data});
      return origWrite.apply(request, arguments);
    };

    return request;
  };
  return http;
}
