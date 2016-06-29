
window.page = {
  navigate(url) {
    return BackgroundProxy.call({
      path: 'tabLoader.update',
      args: [chrome.devtools.inspectedWindow.tabId, {url: url}],
      promise: true
    });
  },
  /**
   * Clicks on element
   * @param {String} selector
   * @param {Number} [index]
   * @returns {Promise}
   */
  click(selector, index = 0) {
    // todo: move elements existance check to separate function
    return ensureSyn()
      .then(() => inspected.eval(`
        (function () {
              const elms = document.querySelectorAll('${selector}');
              if (!elms.length) {
                throw new Error('Elements not found ${selector}');
              } else if (${index} >= elms.length) {
                throw new Error('Elements count ${selector} %i is less than expected index %i',
                  elms.length, ${index});
              } else {
              syn.click(elms[${index}]);
          }
        }());
    `));
  },

  /**
   * Navigates to url in inspected tab
   * @param {String} url
   * @returns {Promise}
   */
 _ensureSyn() {
    return inspected.eval(`Boolean(window.syn)`)
      .then(res => res ? Promise.resolve() : inspected.loadScript(chrome.runtime.getURL('libs/syn.js')))
  }
};
