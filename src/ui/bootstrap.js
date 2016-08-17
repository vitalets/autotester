/**
 * Bootstrap before main bundle to handle errors and set minimal functionality
 */

const errorCatcher = require('../utils/error-catcher');
const HtmlConsole = require('./html-console');
const shareCalls = require('../utils/share-calls');

window.htmlConsole = new HtmlConsole('#console');
window.sharedConsole = shareCalls(console, htmlConsole);
errorCatcher.attach(window, errorHandler);

function errorHandler(error) {
  const msg = '[UI]: ' + error.stack.split('\n').slice(0, 2).join('\n');
  htmlConsole.error(msg);
}
