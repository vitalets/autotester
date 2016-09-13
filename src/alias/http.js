
const httpBrowserify = require('webpack/node_modules/node-libs-browser/node_modules/http-browserify');
const httpsBrowserify = require('webpack/node_modules/node-libs-browser/node_modules/https-browserify');
const fakeHttp = require('../utils/fake-http');

// temp: wrap for logging
const realHttpWrapped = wrapForLog(httpBrowserify, 'REAL');
const realHttpsWrapped = wrapForLog(httpsBrowserify, 'REAL');
const fakeHttpWrapped = wrapForLog(fakeHttp, 'FAKE');

const LOOPBACK_HOST = 'autotester';

module.exports = {
  request(opts) {
    const http = opts.hostname === LOOPBACK_HOST
      ? fakeHttpWrapped
      : (opts.protocol === 'https:' ? realHttpsWrapped : realHttpWrapped);
    return http.request.apply(http, arguments);
  }
};

function wrapForLog(http, prefix) {
  const origRequest = http.request;
  http.request = function (opts, callback) {
    console.info(`${prefix} request`, opts.method, getUrl(opts));
    const req = origRequest.apply(http, arguments);
    req.on('response', response => {
      response.on('data', data => {
        console.info(`${prefix} response`, data);
      });
    });

    const origWrite = req.write;
    req.write = function (data) {
      console.info(`${prefix} request data`, data);
      return origWrite.apply(req, arguments);
    };

    return req;
  };
  return http;
}

function getUrl(options) {
  const {protocol, hostname, port, path} = options;
  return `${protocol}//${hostname}${port ? ':' + port : ''}${path}`;
}
