/**
 * Bootstrap before main bundle
 */

const proxyErrors = require('./proxy-errors');
const browserAction = require('./browser-action');

proxyErrors.setup();
browserAction.setup();
