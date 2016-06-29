/**
 * Operations with inspected window
 * Result wrapped in Promise.
 */
window.inspected = {

  eval(code, nolog) {
    const logCode = code && code.length > 300 ? code.substring(0, 300) + '...' : code;
    if (!nolog) {
      console.log('Evaling in inspected window:', logCode);
    }
    return new Promise((resolve, reject) => {
      chrome.devtools.inspectedWindow.eval(code, (result, exceptionInfo = {}) => {
        if (exceptionInfo.isError) {
          reject(exceptionInfo.description);
        } else if (exceptionInfo.isException) {
          reject(exceptionInfo.value);
        } else {
          resolve(result);
        }
      });
    });
  },

  /**
   * Using eval of text as CSP of target page may reject loading from other domains
   * @param {String} url
   * @returns {Promise}
   */
  loadScript(url) {
    console.log('Loading to inspected window:', url);
    return fetch(url)
      .catch(e => Promise.reject(`Can not fetch url: ${url}`))
      .then(r => r.text())
      .then(code => inspected.eval(code, true));
  }

};
