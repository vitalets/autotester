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
