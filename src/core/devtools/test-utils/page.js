/**
 * Actions with tested page
 */
window.page = {
  /**
   * Eval wrapper with Promises
   * @param {String} code
   * @param {Boolean} [nolog]
   * @returns {Promise}
   */
  eval(code, nolog) {
    const logCode = code && code.length > 300 ? code.substring(0, 300) + '...' : code;
    if (!nolog) {
      console.log('Evaling in inspected window:', logCode);
    }
    return new Promise((resolve, reject) => {
      chrome.devtools.inspectedWindow.eval(code, (result, exceptionInfo = {}) => {
        let msg = ' Error in eval: ' + code;
        if (exceptionInfo.isError) {
          msg = exceptionInfo.description + msg;
          console.error(msg);
          reject(msg);
        } else if (exceptionInfo.isException) {
          msg = exceptionInfo.value + msg;
          console.error(msg);
          reject(msg);
        } else {
          resolve(result);
        }
      });
    });
  },

  evalInFn(code, nolog) {
    return page.eval(`(function() {${code}}())`, nolog);
  },

  /**
   * Using eval of text as CSP of target page may reject loading from other domains
   * @param {String} url
   * @returns {Promise}
   */
  loadScript(url) {
    console.log('Loading to inspected page:', url);
    return fetch(url)
      .catch(e => Promise.reject(`Can not fetch url: ${url}`))
      .then(r => r.text())
      .then(code => page.eval(code, true));
  },

  getUrl() {
    return page.eval('window.location.href');
  },

  navigate(url) {
    return BackgroundProxy.call({
      path: 'tabLoader.update',
      args: [chrome.devtools.inspectedWindow.tabId, {url: url}],
      promise: true
    });
  },

  reload() {
    return page.eval('window.location.reload()');
  },

  /**
   * Clicks on element
   * @param {String} selector
   * @param {Number} [index]
   * @returns {Promise}
   */
  click(selector, index = 0) {
    return page._ensureInjected()
      .then(() => page.evalInFn(`
        const el = window.autotester.el('${selector}', ${index});
        window.syn.click(el);
      `));
  },

  /**
   * Ensures that all required scripts are injected into page
   */
  _ensureInjected() {
    return page.eval(`Boolean(window.autotester)`)
      .then(res => res ? Promise.resolve() : page._inject());
  },

  _inject() {
    const scripts = [
      'core/devtools/test-utils/page-inject.js',
      'libs/syn.js'
    ];
    const tasks = scripts
      .map(scriptUrl => chrome.runtime.getURL(scriptUrl))
      .map(scriptUrl => page.loadScript(scriptUrl));
    return Promise.all(tasks);
  }
};
