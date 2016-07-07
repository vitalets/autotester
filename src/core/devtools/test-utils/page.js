/**
 * Actions with tested page
 * Uses `syn` library for user actions
 * See: https://github.com/bitovi/syn
 *
 * Limitations:
 *
 * 1. In Chrome key emulation is still experimental:
 * https://bugs.webkit.org/show_bug.cgi?id=16735
 * https://bugs.chromium.org/p/chromium/issues/detail?id=327853
 *
 * Working solution:
 * http://stackoverflow.com/questions/10455626/keydown-simulation-in-chrome-fires-normally-but-not-the-correct-key/10520017#10520017
 *
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
        // window.syn.click(el);
        el.click();
      `));
  },

  type(selector, text, index = 0) {
    return page._ensureInjected()
      .then(() => page.evalInFn(`
        const el = window.autotester.el('${selector}', ${index});
        window.syn.type(el, '${text}');
      `));
  },

  key(selector, key, index = 0) {
    return page._ensureInjected()
      .then(() => page.evalInFn(`
        const el = window.autotester.el('${selector}', ${index});
        window.syn.key(el, '${key}');
      `));
  },

  /**
   * Submit form of input.
   * This method is needed because Chrome can not simulate submit by <enter>
   * as we can't focus element while devtools is open.
   * @see http://stackoverflow.com/questions/14783585/jquery-focus-command-doesnt-work-from-chrome-command-line
   *
   * @param {String} selector
   */
  submit(selector) {
    return page._ensureInjected()
      .then(() => page.evalInFn(`
        const el = window.autotester.el('${selector}');
        el.form.submit();
      `));
  },

  /**
   * Returns element porperty
   * @param {String} selector
   * @param {String} prop
   * @returns {Promise}
     */
  elemProp(selector, prop) {
    return page._ensureInjected()
      .then(() => page.eval(`autotester.elemProp('${selector}', '${prop}')`));
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
      'core/libs/syn.js'
    ];
    const tasks = scripts
      .map(scriptUrl => chrome.runtime.getURL(scriptUrl))
      .map(scriptUrl => page.loadScript(scriptUrl));
    return Promise.all(tasks);
  }
};
