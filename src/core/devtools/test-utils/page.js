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
   * @param {String|Array} selector
   * @returns {Promise}
   */
  click(selector) {
    return this._elemEval(selector, `syn.click(elem)`);
  },

  /**
   * Simulate keyboard input
   *
   * Syn has two similar methods:
   * type() - for entering specific string
   * key() - for simulating specific keys of keyboard
   * See: https://github.com/bitovi/syn/issues/84
   *
   * @param {String|Array} selector
   * @param {String} text
   * @returns {Promise}
   */
  type(selector, text) {
    return this._elemEval(selector, `syn.type(elem, '${text}')`);
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
    return this._elemEval(selector, `elem.form.submit()`);
  },

  /**
   * Returns element property
   * @param {String|Array} selector
   * @param {String} prop
   * @returns {Promise}
   */
  elemProp(selector, prop) {
    return this._elemEval(selector, `return elem.${prop}`);
  },

  /**
   * Eval any string with DOM element
   * Selector can be string '.classname' or array ['.classname', <index>]
   * @param {String|Array} selector
   * @param {String} evalStr
   * @returns {Promise}
   */
  _elemEval(selector, evalStr) {
    const elemArgs = Array.isArray(selector) ? `'${selector[0]}', ${selector[1]}` : `'${selector}'`;
    return page._ensureInjected()
      .then(() => page.evalInFn(`
        const elem = autotester.elem(${elemArgs});
        ${evalStr};
      `));
  },

  /**
   * Ensures that all required scripts are injected into page
   */
  _ensureInjected() {
    return page.eval(`Boolean(window.autotester)`)
      .then(res => res ? Promise.resolve() : page._inject());
  },

  /**
   * Injects all needed scripts into page
   * @returns {Promise}
   */
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
