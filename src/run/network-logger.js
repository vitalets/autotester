/**
 * Logs real and fake http requests
 */

const httpAlias = require('../alias/http');
const logger = require('../utils/logger').create('Network');

/**
 * Set listeners (once)
 */
exports.init = function () {
  if (!httpAlias.onRequest.hasListener(onRequest)) {
    httpAlias.onRequest.addListener(onRequest);
    httpAlias.onRequestData.addListener(onRequestData);
    httpAlias.onResponse.addListener(onResponse);
  }
};

function onRequest({request, options}) {
  logger.log(`${getPrefix(request)} request`, options.method, getUrl(options));
}

function onRequestData({request, data}) {
  logger.log(`${getPrefix(request)} request data`, data);
}

function onResponse({response, data}) {
  // copied from selenium-webdriver
  data = data.replace(/\0/g, '');
  // strip big 'screen' prop with encoded screenshot
  if (response.statusCode !== 200) {
    data = stripScreenshot(data);
  }
  logger.log(`${getPrefix(response)} response`, response.statusCode, data);
}

function getPrefix(obj) {
  return obj.isFake ? 'LOOPBACK' : 'REAL';
}

function getUrl(options) {
  const {protocol, hostname, port, path} = options;
  return `${protocol}//${hostname}${port ? ':' + port : ''}${path}`;
}

function stripScreenshot(body) {
  return body.replace(/"screen":"[^"]+"/, '"screen":"_stripped_"');
}
