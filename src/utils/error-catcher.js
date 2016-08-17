/**
 * Catches all unhandled errors and unhandled promise rejections, then routes it to handler
 * Can avoid circular errors and store errors until handler attached.
 *
 * todo: store errors until handler set
 *
 * see: https://developer.mozilla.org/en/docs/Web/API/GlobalEventHandlers/onerror
 * see: https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection
 */

/**
 * If the same error comes within this timeout, we ignore it to avoid endless loop
 * Timeout is progressively increased
 */
const EQUAL_ERRORS_TIMEOUT_MIN = 50;
const EQUAL_ERRORS_TIMEOUT_MAX = 60 * 1000;

let currentTimeout = null;
let handler = null;
let lastErrorEvent = null;

/**
 * Attach to window for catching errors
 *
 * @param {Window} win
 * @param {Function} [handler]
 */
exports.attach = function (win, handler) {
  win.addEventListener('error', processError);
  win.addEventListener('unhandledrejection', processError);
  resetTimeout();
  if (handler) {
    exports.setHandler(handler);
  }
};

/**
 * Sets handler to process errors
 * @param {Function} newHandler
 */
exports.setHandler = function (newHandler) {
  if (typeof newHandler === 'function') {
    handler = newHandler;
  } else {
    throw new Error('Error handler should be function');
  }
};

function processError(errorEvent) {
  if (isEqualEvents(lastErrorEvent, errorEvent)) {
    if (getEventsDelta(lastErrorEvent, errorEvent) <= currentTimeout) {
      lastErrorEvent = errorEvent;
      errorEvent.preventDefault();
      return;
    } else {
      increaseTimeout();
    }
  } else {
    resetTimeout();
  }
  lastErrorEvent = errorEvent;
  if (handler) {
    const error = getErrorFromEvent(errorEvent);
    // run handler in nextTick to catch handler-own instant errors normally
    setTimeout(() => {
      handler(error, errorEvent);
    }, 0);
  }
}

function isEqualEvents(errorEvent1, errorEvent2) {
  if (!errorEvent1 || !errorEvent2 || errorEvent1.type !== errorEvent2.type) {
    return false;
  }
  const error1 = getErrorFromEvent(errorEvent1);
  const error2 = getErrorFromEvent(errorEvent2);
  return error1.message === error2.message && error1.stack === error2.stack;
}

function getEventsDelta(event1, event2) {
  return Math.abs(event1.timeStamp - event2.timeStamp);
}

function getErrorFromEvent(errorEvent) {
  // `.reason` for promise, `.error` for regular errors
  return errorEvent.reason || errorEvent.error;
}

function resetTimeout() {
  if (currentTimeout !== EQUAL_ERRORS_TIMEOUT_MIN) {
    currentTimeout = EQUAL_ERRORS_TIMEOUT_MIN;
  }
}

function increaseTimeout() {
  if (currentTimeout < EQUAL_ERRORS_TIMEOUT_MAX) {
    currentTimeout = currentTimeout * 2;
    if (currentTimeout > EQUAL_ERRORS_TIMEOUT_MAX) {
      currentTimeout = EQUAL_ERRORS_TIMEOUT_MAX;
    }
  }
}

