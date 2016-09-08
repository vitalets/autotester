/**
 * Bootstrap before main bundle to handle errors and set minimal functionality
 */

const errorCatcher = require('../utils/error-catcher');
const HtmlConsole = require('../utils/html-console');
const shareCalls = require('../utils/share-calls');

require('mocha/mocha.css');
require('./ui.css');

window.htmlConsole = new HtmlConsole('#console');
window.sharedConsole = shareCalls(console, htmlConsole);
errorCatcher.attach(window, errorHandler);

function errorHandler(error) {
  error = error || '';
  const msg = '[UI]: ' + (error.stack || error.message || String(error));
  htmlConsole.error(msg);
}
