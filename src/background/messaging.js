/**
 * Control messages flow between bg and tabs
 * Bg messages are received by all tabs
 * Tab messages are received only by background
 * Internal msg format:
 * {
 *   name: {String}
 *   toBg: {Boolean}
 *   payload: {*}
 * }
 */

const keyMirror = require('keymirror');

/**
 * List of all messages
 */
exports.names = keyMirror({
  // from tab
  LOAD_TESTS_CONFIG: null,
  RUN_TESTS: null,
  SELECT_TEST: null,
  // from bg
  LOAD_TESTS_CONFIG_DONE: null,
  RUN_TESTS_STARTED: null,
  RUN_TESTS_DONE: null,
});

const listeners = new Map();

/**
 * Start listen messages
 */
exports.start = function () {
  chrome.runtime.onMessage.addListener(onMessage);
};

/**
 * Send message from tab to bg OR visa-versa
 * @param {String} name
 * @param {*} payload
 */
exports.send = function (name, payload) {
  assertMessageName(name);
  const msg = {
    name,
    toBg: !isBackgroundPage(),
    payload,
  };
  chrome.runtime.sendMessage(msg);
};

/**
 * Add listener to message
 * @param {String} name
 * @param {Function} fn
 */
exports.on = function (name, fn) {
  assertMessageName(name);
  const msgListeners = listeners.get(name) || [];
  msgListeners.push(fn);
  listeners.set(name, msgListeners);
};

function onMessage(msg, sender, sendResponse) {
  if (msg.toBg !== isBackgroundPage()) {
    return;
  }
  const msgListeners = listeners.get(msg.name);
  if (msgListeners && msgListeners.length) {
    const results = msgListeners.map(listener => {
      try {
        return listener(msg.payload, sender, sendResponse);
      } catch (e) {
        // we need to re-throw error in next tick to be out of onMessage handler and allow event to bubble
        setTimeout(() => {
          throw e;
        }, 0);
      }
    });
    // if at least some result is true, we should return it here
    // to show that sendResponse will be called asynchroniously
    return results.some(Boolean);
  }
}

function isBackgroundPage() {
  if (isBackgroundPage.result === undefined) {
    isBackgroundPage.result = chrome.extension.getBackgroundPage() === window;
  }
  return isBackgroundPage.result;
}

function assertMessageName(name) {
  const exists = Object.keys(exports.names).some(key => exports.names[key] === name);
  if (!exists) {
    throw new Error(`Unknown message name ${name}`);
  }
}
