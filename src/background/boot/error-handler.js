/**
 * Handler for uncaught errors that proxies it to ui
 * Prefix not useful as there can be errors in tests that are executed in background.
 */

const utils = require('../../utils');

module.exports = function (error) {
  if (error.isMocha) {
    // don't display mocha errors as mocha do it itself
    return;
  }

  const msg = getMsg(error);
  getViews().forEach(view => {
    // log to ui html console if exists
    if (view.htmlConsole) {
      view.htmlConsole.error(msg);
    }
  });
};

function getViews() {
  return chrome.extension.getViews({type: 'tab'});
}

function getMsg(error) {
  return typeof error === 'object'
    ? (utils.cleanStack(error.stack) || error.message || error.name)
    : String(error);
}
