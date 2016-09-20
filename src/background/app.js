/**
 * Main App controller
 */

const specialUrlCatcher = require('./special-url-catcher');
const uiApi = require('./ui-api');
const logger = require('../utils/logger').create('App');

exports.start = function() {
  uiApi.init();
  uiApi.reloadUI();
  specialUrlCatcher.start();
  logger.log('Background started');
};
