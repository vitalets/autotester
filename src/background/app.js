/**
 * Main App controller
 */

const fs = require('bro-fs');
const specialUrlCatcher = require('./special-url-catcher');
const uiApi = require('./ui-api');
const {onReady} = require('./internal-channels');
const logger = require('../utils/logger').create('App');

exports.start = function() {
  uiApi.init();
  specialUrlCatcher.start();
  return fs.init({type: window.PERSISTENT})
    .then(() => {
      logger.log('Ready');
      onReady.dispatch();
    });
};
