/**
 * Control messages flow between bg and tabs
 * - bg messages are received by all tabs
 * - tab messages are received only by background
 * Internal msg format:
 * {
 *   name: {String}
 *   payload: {*}
 * }
 *
 * message - is transport layer, via chrome runtime
 * event - something that occurs and should be transferred
 */

const registeredListeners = new Map();
const registeredEvents = new Set();
// todo: will not work for event-pages
const isBackgroundPage = chrome.extension.getBackgroundPage() === window;

/**
 * Start listen messages
 *
 * @param {Object} [events] available events
 */
exports.start = function (events) {
  if (events) {
    exports.registerEvents(events);
  }
  chrome.runtime.onMessage.addListener(onMessage);
};

/**
 * Register events
 */
exports.registerEvents = function (events) {
  if (Array.isArray(events)) {
    events.forEach(key => registeredEvents.add(events[key]));
  } else if (events && typeof events === 'object') {
    Object.keys(events).forEach(key => registeredEvents.add(events[key]));
  } else {
    throw new Error('Events should be array or object to register');
  }
};

/**
 * Send message from tab to bg OR visa-versa
 * @param {String} name
 * @param {*} payload
 */
exports.send = function (name, payload) {
  assertEventName(name);
  const msg = wrapKnownMessage({name, payload});
  return new Promise(resolve => {
    chrome.runtime.sendMessage(msg, resolve);
  });
};

/**
 * Add listener to message
 * @param {String} name
 * @param {Function} fn
 */
exports.on = function (name, fn) {
  assertEventName(name);
  const msgListeners = registeredListeners.get(name) || [];
  msgListeners.push(fn);
  registeredListeners.set(name, msgListeners);
};

function onMessage(msg, sender, sendResponse) {
  if (!isKnownMessage(msg)) {
    return;
  }

  const fromTabToTab = sender.tab && !isBackgroundPage;
  const fromBgToBg = !sender.tab && isBackgroundPage;
  if (fromTabToTab || fromBgToBg) {
    return;
  }

  assertEventName(msg.name);

  const msgListeners = registeredListeners.get(msg.name);
  if (msgListeners && msgListeners.length) {
    const results = msgListeners.map(listener => {
      try {
        return listener(msg.payload, sender, sendResponse);
      } catch (e) {
        // we need to re-throw error in next tick to be out of onMessage handler and allow event to bubble
        // todo: copy error stack
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

function assertEventName(name) {
  if (!registeredEvents.has(name)) {
    throw new Error(`Unknown event ${name}`);
  }
}

function isKnownMessage(msg) {
  return msg && msg.isMessaging;
}

function wrapKnownMessage(msg) {
  return Object.assign(msg, {
    isMessaging: true
  });
}
