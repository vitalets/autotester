/**
 * Bootstrap before main bundle
 */

const errorCatcher = require('../utils/error-catcher');
const errorHandler = require('./error-handler');
const browserAction = require('./browser-action');
const thenChrome = require('then-chrome');

// export thenChrome for debug
window.thenChrome = thenChrome;
// catch all errors ans proxy to ui
errorCatcher.attach(window, errorHandler);
// set browserAction click handler to open ui
browserAction.setup();
