/**
 * Implements cross-context calls via chrome messaging.
 *
 * This file should be included in both contexts.
 *
 * Example:
 *
 * callProxy('chrome.tabs.query', {active: true}).then(tabs => console.log(tabs));
 *
 */

const EVENT_NAME1 = 'call-proxy';

(function () {
  const EVENT_NAME = 'call-proxy';
  const isBackgroundContext = Boolean(chrome.runtime.getBackgroundPage);

  if (isBackgroundContext) {
    chrome.runtime.onMessage.addListener(bgListener);
    console.log('Call proxy listening...');
  } else {
    window.callProxy = callProxy;
  }

  /**
   * Handle messages from other contextsб execute calls
   * @param {Object} msg
   * @param {Object} sender
   * @param {Function} sendResponse node-style callback to detect errors
   */
  function bgListener(msg, sender, sendResponse) {
    msg = msg || {};

    if (msg.name !== EVENT_NAME) {
      return;
    }

    const successCallback = sendResponse;
    const errorCallback = err => sendResponse({__err: err.message});

    if (typeof msg.path !== 'string') {
      errorCallback(new Error('Path should be string'));
      return;
    }

    const obj = tryCatch(() => getNested(msg.path), errorCallback);

    if (typeof obj.target === 'function') {
      // console.log('Call proxy:', msg.path);
      const isAsync = msg.async !== undefined ? msg.async : isChromeApiPath(msg.path);
      const args = Array.isArray(msg.args) ? msg.args : [];
      const fn = () => tryCatch(() => obj.target.apply(obj.parent, args), errorCallback);
      if (isAsync) {
        // async call with latest param as callback
        args.push(successCallback);
        fn();
        return true;
      } else if (msg.promise) {
        // promise call
        fn()
          .then(successCallback)
          .catch(errorCallback);
        return true;
      } else {
        // sync function call
        successCallback(fn());
      }
    } else {
      // not a function, just return object
      successCallback(obj.target);
    }
  }

  /**
   * Call background method from another context
   * @param {String|Object} path
   * @returns {Promise}
   */
  function callProxy(path) {
    const props = typeof path === 'string' ? {
      path: path,
      args: [].slice.call(arguments, 1)
    } : path;
    const msg = Object.assign({}, props, {name: EVENT_NAME});
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(msg, result => result && result.__err ? reject(result.__err) : resolve(result));
    });
  }

  function tryCatch(fn, errorCallback) {
    try {
      return fn();
    } catch (e) {
      errorCallback(e);
      throw e;
    }
  }

  function isChromeApiPath(path) {
    return /^chrome\./.test(path);
  }

  /**
   * Returns nested child of object by path
   * @param {String} path
   * @param {Object} parent
   * @returns {Object}
   */
  function getNested(path, parent = window) {
    return path.split('.').reduce((res, key) => {
      return {
        parent: res.target,
        target: res.target[key]
      };
    }, {
      parent: null,
      target: parent
    });
  }
}());
