/**
 * Implements calls of background page methods from contentscripts/devtools via chrome messaging.
 * Calls are Promise wrapped.
 *
 * Usage:
 * // background page
 * BackgroundProxy.listen();
 *
 * // contentscript
 * BackgroundProxy.call('chrome.tabs.query', {active: true})
 *   .then(tabs => console.log(tabs))
 *   .catch(e => console.error(e));
 *
 */

class BackgroundProxy {
  /**
   * Start listen messages in background
   */
  static listen() {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg && msg.name === 'background-call') {
        const successCallback = data => sendResponse({data: data});
        const errorCallback = error => sendResponse({error: error.message || 'Unknown error'});
        return new BackgroundProxyExecuter(msg, successCallback, errorCallback).run();
      }
    });
  }

  /**
   * Call method in background from another context
   * @param {String|Object} params
   * @returns {Promise}
   */
  static call(params) {
    if (typeof params === 'string') {
      params = {
        path: params,
        args: [].slice.call(arguments, 1)
      };
    }
    const msg = Object.assign({}, params, {name: 'background-call'});
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(msg, result => {
        return result && result.error ? reject(result.error) : resolve(result.data);
      });
    });
  }
}

/**
 * Helper class to execute msg with success/error callbacks
 */
class BackgroundProxyExecuter {
  constructor(msg, successCallback, errorCallback) {
    this.msg = msg;
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
  }
  run() {
    // wrap everything in try..catch to notify caller in case of error
    try {
      return this._runUnsafe();
    } catch (e) {
      this.errorCallback(e);
      throw e;
    }
  }
  _runUnsafe() {
    const obj = BackgroundProxyExecuter._getNested(this.msg.path);
    if (typeof obj.target === 'function') {
      return this._callFn(obj.target, obj.parent);
    } else {
      // just return object
      this.successCallback(obj.target);
    }
  }
  _callFn(fn, thisArg) {
    const msg = this.msg;
    const isAsync = msg.async !== undefined ? msg.async : BackgroundProxyExecuter._isChromeApiPath(msg.path);
    const args = Array.isArray(msg.args) ? msg.args : [];
    const fnBinded = () => fn.apply(thisArg, args);
    if (isAsync) {
      // async call with latest param as callback (node-style)
      args.push(this.successCallback);
      fnBinded();
      // this informs chrome messaging that callback will be called asynchroniously
      return true;
    } else if (msg.promise) {
      fnBinded().then(this.successCallback).catch(this.errorCallback);
      // this informs chrome messaging that callback will be called asynchroniously
      return true;
    } else {
      // sync function call
      this.successCallback(fnBinded());
      return false;
    }
  }
  /**
   * Returns nested child of object by path
   * @param {String} path
   * @param {Object} parent
   * @returns {Object}
   */
  static _getNested(path, parent = window) {
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
  static _isChromeApiPath(path) {
    return /^chrome\./.test(path);
  }
}
