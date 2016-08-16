/**
 * Proxy all unhandled errors and rejections to all extension UIs
 */

const TEST_PREFIX = '[TEST]: ';
const BG_PREFIX = '[BACKGROUND]: ';

exports.setup = function () {
  window.addEventListener('error', errEvent => {
    sendError(errEvent.error);
  });

  // see: https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection
  window.addEventListener('unhandledrejection', promiseErrEvent => {
    sendError(promiseErrEvent.reason);
  });
};

function sendError(error) {
  const msg = getMsg(error);
  getViews().forEach(view => {
    const console = view.sharedConsole || view.console;
    console.error(msg);
  });
}

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
