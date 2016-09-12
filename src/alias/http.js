
const httpBrowserify = require('webpack/node_modules/node-libs-browser/node_modules/http-browserify');
const fakeHttp = require('../utils/fake-http');

const realHttpWrapped = wrapForLog(httpBrowserify, 'REAL');
const fakeHttpWrapped = wrapForLog(fakeHttp, 'FAKE');

module.exports = {
  get request () {
    // todo: use fake public method
    const http = window.fake ? fakeHttpWrapped : realHttpWrapped;
    return http.request;
  }
};

function wrapForLog(http, prefix) {
  const origRequest = http.request;
  http.request = function (opts, callback) {
    const url = opts.method + ' ' + opts.protocol + '//' + opts.hostname + ':' + opts.port + opts.path;
    console.info(`${prefix} request`, url);
    const req = origRequest.apply(http, arguments);
    req.on('response', response => {
      response.on('data', data => {
        const r = data;
        //const r = data ? JSON.stringify(JSON.parse(data), false, 2) : data;
        console.info(`${prefix} response`, r);
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
