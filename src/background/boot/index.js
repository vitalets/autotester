/**
 * Bootstrap before main bundle
 */

// export thenChrome for debug
window.thenChrome = require('then-chrome');
const errorCatcher = require('../../utils/error-catcher');
const errorHandler = require('./error-handler');
const browserAction = require('./browser-action');

// catch all errors and proxy to ui
errorCatcher.attach(window, errorHandler);
// set browserAction click handler to open ui
browserAction.setup();
