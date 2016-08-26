/**
 * Handler for uncaught errors that proxies it to ui
 */

const escapeStringRegexp = require('escape-string-regexp');

const TEST_PREFIX = '[TEST]: ';
const BG_PREFIX = '[BACKGROUND]: ';

let selfUrlREgexp;

module.exports = function (error) {
  if (error.isMocha) {
    // don't display mocha errors as mocha do it itself
    return;
  }
  const msg = getMsg(error);
  getViews().forEach(view => {
    const console = view.sharedConsole || view.console;
    console.error(msg);
  });
};

function getViews() {
  return chrome.extension.getViews({type: 'tab'});
}

function getMsg(error) {
  const prefix = error.isTestSelf ? TEST_PREFIX : BG_PREFIX;
  const msg = cleanStack(error.stack) || error.message || `Unknown error: ${error}`;
  return prefix + msg;
}

/**
 * Remove 'chrome-extension://cidkhbpkgpdkadkjpkfooofilpmfneog/' part from stack as it just garbage
 *
 * @param {String} stack
 */
function cleanStack(stack) {
  return typeof stack === 'string'
    ? stack.replace(getSelfUrlRegexp(), '')
    : stack;
}

function getSelfUrlRegexp() {
  if (!selfUrlREgexp) {
    const selfUrl = chrome.runtime.getURL('');
    const escaped = escapeStringRegexp(selfUrl);
    selfUrlREgexp = new RegExp(escaped, 'g');
  }
  return selfUrlREgexp;
}
