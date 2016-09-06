/**
 * Utils
 */

const escapeStringRegexp = require('escape-string-regexp');

/**
 * Loads script via <script> tag
 *
 * @param {String} url
 * @param {Object} targetDocument
 * @returns {Promise}
 */
exports.loadScript = function (url, targetDocument = document) {
  return new Promise(function (resolve, reject) {
    const script = targetDocument.createElement('script');
    script.type = 'text/javascript';
    targetDocument.getElementsByTagName('head')[0].appendChild(script);
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Can not load script ${url}`));
    script.src = url;
  });
};

/**
 * Fetch script via window.fetch
 *
 * @param {String} url
 * @returns {Promise}
 */
exports.fetchText = function (url) {
  return window.fetch(url)
    .then(r => r.text())
};

/**
 * Throws error in next tick
 *
 * @param {Error} error
 */
exports.asyncThrow = function (error) {
  setTimeout(() => {
    throw error;
  }, 0);
};

/**
 * Copies object without first-level undefined props
 * Useful for using Object.assign to set defaults
 *
 * @param {Object} obj
 */
exports.noUndefined = function (obj) {
  return Object.keys(obj).reduce((res, key) => {
    if (obj[key] !== undefined) {
      res[key] = obj[key];
    }
    return res;
  }, {})
};


/**
 * Trim slashes
 *
 * @param {String} str
 * @returns {String}
 */
exports.trimSlashes = function (str) {
  return str.replace(/^\/+|\/+$/g, '');
};

/**
 * Remove useless paths from error stack:
 * - filesystem:chrome-extension://cidkhbpkgpdkadkjpkfooofilpmfneog/persistent/
 * - chrome-extension://cidkhbpkgpdkadkjpkfooofilpmfneog/
 *
 * @param {String} stack
 */
exports.cleanStack = function(stack) {
  if (typeof stack !== 'string') {
    return stack;
  }
  const selfUrl = chrome.runtime.getURL('');
  const selfFsUrl = `filesystem:${selfUrl}persistent/`;
  const regStr = '(' + escapeStringRegexp(selfFsUrl) + ')|(' + escapeStringRegexp(selfUrl) + ')';
  const re = new RegExp(regStr, 'g');
  return stack.replace(re, '');
};
