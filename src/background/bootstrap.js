/**
 * Bootstrap before main bundle
 */

const errorCatcher = require('../utils/error-catcher');
const errorHandler = require('./error-handler');
const browserAction = require('./browser-action');

errorCatcher.attach(window, errorHandler);
browserAction.setup();
