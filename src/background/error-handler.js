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
  return error.testMessage
    ? TEST_PREFIX + error.testMessage
    : BG_PREFIX + cutStack(error.stack);
}

function cutStack(stack) {
  return stack.split('\n').slice(0, 2).join('\n');
}
