/**
 * Utils
 */

/**
 * Loads script via <script> tag
 *
 * @param {String} url
 * @returns {Promise}
 */
exports.loadScript = function (url) {
  return new Promise(function (resolve, reject) {
    console.log('Loading script', url);
    const script = document.createElement('script');
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Can not load script ${url}`));
    script.src = url;
  });
};

/**
 * Fetch script via window.fetch + eval as commonjs
 *
 * @param {String} url
 * @returns {Promise}
 */
exports.fetchCommonjsScript = function (url) {
  return fetch(url)
    .catch(e => Promise.reject(`Can not fetch url: ${url}`))
    .then(r => r.text())
    .then(text => exports.evalCommonjs(text))
};

exports.evalCommonjs = function (code) {
  const wrapped = `(function(module, exports = module.exports) {
        ${code}
        return module;
      })({exports: {}})`;
  return window.eval(wrapped).exports;
};
