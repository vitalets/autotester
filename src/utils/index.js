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
 * Fetch script via window.fetch
 *
 * @param {String} url
 * @returns {Promise}
 */
exports.fetchText = function (url) {
  return window.fetch(url)
    .catch(e => Promise.reject(`Can not fetch text url: ${url}`))
    .then(r => r.text())
};

/**
 * Parallel fetch text from urls
 * @param {Array} urls
 * @returns {Promise}
 */
exports.fetchTextFromUrls = function (urls) {
  const tasks = urls.map(url => {
    return exports.fetchText(url)
      .then(text => {
        return {url, text};
      });
  });
  return Promise.all(tasks);
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
