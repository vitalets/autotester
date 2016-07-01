/**
 * Actions for testing chrome extensions
 */

window.extension = {
  id: '',
  /**
   * Checks if passed url is extension url and parse extension id from it
   * @param {String} url
   */
  processPageUrl(url) {
    const parsedUrl = new URL(url);
    extension.id = parsedUrl.protocol === 'chrome-extension:' ? parsedUrl.hostname : '';
  },
  uninstall() {
    return page.eval('chrome.management.uninstallSelf()');
  },
  reload() {
    return page.eval('chrome.runtime.reload()');
  }
};


/*
 document.querySelector('#silent-debugger-extension-api a.experiment-enable-link').click()
 document.querySelector('#silent-debugger-extension-api a.experiment-disable-link').style.display === 'none';
 document.querySelector('.experiment-restart-button').click();
 */
