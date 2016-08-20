/**
 * Handler for uncaught errors that proxies it to ui
 */

const TEST_PREFIX = '[TEST]: ';
const BG_PREFIX = '[BACKGROUND]: ';

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
  const stack = error.isTestSelf ? cutStack(error.stack) : error.stack;
  const msg = stack || error.message || `Unknown error: ${error}`;
  return prefix + msg;
}

/**
 * Cuts stack to first `eval` line as everything after it usually useless
 * @param {String} stack
 * @returns {String}
 */
function cutStack(stack) {
  const evalMarker = 'eval at <anonymous>';
  const lines = stack.split('\n');
  const result = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].indexOf(evalMarker) >= 0) {
      break;
    } else {
      result.push(lines[i]);
    }
  }
  return result.join('\n');
}
