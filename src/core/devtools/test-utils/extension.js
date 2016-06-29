/**
 * Actions for testing chrome extensions
 */

window.extension = {
  id: '',
  checkUrl(url) {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol === 'chrome-extension:') {
      extension.id = parsedUrl.hostname;
      return true;
    } else {
      extension.id = '';
      return false;
    }
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
