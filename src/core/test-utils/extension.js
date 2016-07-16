/**
 * Actions for testing chrome extensions
 */

window.extension = {
  /**
   * Looks for extension id  in URL, e.g. 'chrome-extension://abcsdfrgsdfgsdfg'
   * @param {String} url
   */
  getIdFromUrl(url) {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'chrome-extension:' ? parsedUrl.hostname : '';
  },
  uninstall() {
    return page.eval('chrome.management.uninstallSelf()');
  },
  restart() {
    return page.eval('chrome.runtime.reload()');
  }
};


/*
 document.querySelector('#silent-debugger-extension-api a.experiment-enable-link').click()
 document.querySelector('#silent-debugger-extension-api a.experiment-disable-link').style.display === 'none';
 document.querySelector('.experiment-restart-button').click();
 */
