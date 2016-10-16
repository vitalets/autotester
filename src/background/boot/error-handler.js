/**
 * Handler for uncaught errors that proxies it to ui
 * Prefix not useful as there can be errors in tests that are executed in background.
 */

const utils = require('../../utils');

/**
 * For that error we show additional warning with link to chrome://flags
 */
const CHROME_URL_ACCESS_ERROR = 'Cannot access a chrome-extension:// URL of different extension';

module.exports = function (error) {
  const msg = getMsg(error);
  processChromeUrlAccessError(msg);
  if (error.isMocha) {
    // don't display mocha errors as mocha do it itself
    return;
  }
  showInAllViews('error', msg);
};

function showInAllViews(method/*, msg1, msg2, ...*/) {
  const args = Array.prototype.slice.call(arguments, 1);
  chrome.extension.getViews({type: 'tab'}).forEach(view => {
    if (view.htmlConsole) {
      view.htmlConsole[method].apply(view.htmlConsole, args);
    }
  });
}

function getMsg(error) {
  return typeof error === 'object'
    ? (utils.cleanStack(error.stack) || error.message || error.name)
    : String(error);
}

function processChromeUrlAccessError(msg) {
  if (typeof msg === 'string' && msg.indexOf(CHROME_URL_ACCESS_ERROR) >= 0) {
    showInAllViews(
      'warn',
      'Please enable chrome flag to allow debug of extensions',
      'chrome://flags/#extensions-on-chrome-urls'
    )
  }
}
