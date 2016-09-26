/**
 * Main App controller
 */

const specialUrlCatcher = require('./special-url-catcher');
const uiApi = require('./ui-api');
const {onReady} = require('./internal-channels');
const logger = require('../utils/logger').create('App');

exports.start = function() {
  uiApi.init();
  specialUrlCatcher.start();
  logger.log('Ready');
  onReady.dispatch();
};
