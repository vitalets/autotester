
window.browser = {
  /**
   * Open url in new tab
   * @param {String} url
   * @param {Number} [count]
   * @returns {Promise}
   */
  openUrl(url, count = 1) {
    const tasks = [];
    for (let i = 0; i < count; i++) {
      const task = BackgroundProxy.call({
        path: 'tabLoader.create',
        args: [{url: url, active: false}],
        promise: true
      });
      tasks.push(task);
    }
    return Promise.all(tasks);
  },

  /**
   * Open several urls
   * @param {Array} arr array of {url, count}
   * @returns {Promise}
   */
  openUrls(arr) {
    const tasks = arr.map(item => browser.openUrl(item.url, item.count || 1));
    return Promise.all(tasks);
  },

  /**
   * Clear browsing history
   * @returns {Promise}
   */
  clearHistory() {
    return BackgroundProxy.call('chrome.history.deleteAll');
  },

  /**
   * Close all tabs except tested
   */
  closeOtherTabs() {
    BackgroundProxy.call('chrome.tabs.query', {})
      .then(tabs => {
        const ids = tabs.map(tab => tab.id).filter(id => id !== chrome.devtools.inspectedWindow.tabId);
        return BackgroundProxy.call('chrome.tabs.remove', ids);
      })
  }
};
