/**
 * Commands for page dialogs: alert/confirm/prompt/onbeforeunload
 */

const Targets = require('../targets');

/**
 * Gets dialog text
 *
 * @returns {Promise}
 */
exports.getText = function () {
  // todo: use Page.javascriptDialogOpening event to store dialog text. currently return dummy text
  return Promise.resolve('dialog text');
};

/**
 * Accepts dialog
 *
 * @returns {Promise}
 */
exports.accept = function () {
  return action(true);
};

/**
 * Dismiss dialog
 *
 * @returns {Promise}
 */
exports.dismiss = function () {
  return action(false);
};

function action(accept = true) {
  return Targets.debugger.sendCommand('Page.handleJavaScriptDialog', {accept});
}
