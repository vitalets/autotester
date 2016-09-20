/**
 * Global errors catcher
 */

const errorCatcher = require('../../utils/error-catcher');
//const store = require('../store').store;
// const HtmlConsole = require('../../utils/html-console');
//const shareCalls = require('../../utils/share-calls');

exports.init = function () {
  // window.htmlConsole = new HtmlConsole('#console');
  // window.sharedConsole = shareCalls(console, htmlConsole);
  errorCatcher.attach(window, errorHandler);
};

function errorHandler(error) {
  error = error || '';
  // store.error = '[UI]: ' + (error.stack || error.message || String(error));
}
