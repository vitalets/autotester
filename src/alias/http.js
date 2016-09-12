
const httpBrowserify = require('webpack/node_modules/node-libs-browser/node_modules/http-browserify');
const fakeHttp = require('../utils/fake-http');

// temp: wrap for logging
const realHttpWrapped = wrapForLog(httpBrowserify, 'REAL');
const fakeHttpWrapped = wrapForLog(fakeHttp, 'FAKE');

module.exports = {
  // this actually defines whether http module will be fake or not
  loopback: true,
  get request () {
    const http = module.exports.loopback ? fakeHttpWrapped : realHttpWrapped;
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
