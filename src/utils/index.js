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
exports.loadScript = function (url, doc = document) {
  return new Promise(function (resolve, reject) {
    const script = doc.createElement('script');
    script.type = 'text/javascript';
    doc.getElementsByTagName('head')[0].appendChild(script);
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Can not load script ${url}`));
    script.src = url;
  });
};

/**
 * Remove elements by selector
 *
 * @param {String} selector
 * @param {Document} [doc]
 */
exports.removeBySelector = function (selector, doc = document) {
  [].forEach.call(doc.querySelectorAll(selector), el => {
    el.parentNode.removeChild(el);
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
  const url = chrome.runtime.getURL('');
  const urlFs = `filesystem:${url}persistent/`;
  const urlRe = new RegExp(escapeStringRegexp(url), 'g');
  const urlFsRe = new RegExp(escapeStringRegexp(urlFs), 'g');
  return stack
    .replace(urlFsRe, '')
    .replace(urlRe, '')
};

/**
 * Cuts local url
 *
 * @param {String} localUrl
 */
exports.cutLocalUrl = function (localUrl) {
  return localUrl
    .replace(`filesystem:chrome-extension://${chrome.runtime.id}/persistent/`, '')
    .replace(`chrome-extension://${chrome.runtime.id}/`, '');
};

/**
 * Is valid url
 *
 * @param {String} str
 */
exports.isValidUrl = function (str) {
  try {
    new URL(str);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Safer version of path.join() that can also join url with path
 * (lib from node-browserify remove second slash after protocol `http://abc` --> `http:/abc`)
 */
exports.join = function () {
  return [].map.call(arguments, arg => exports.trimSlashes(arg)).join('/');
};
