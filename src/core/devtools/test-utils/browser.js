
window.browser = {
  openTab(url) {
    return BackgroundProxy.call({
      path: 'tabLoader.create',
      args: [{url: url, active: false}],
      promise: true
    });
  },
  openTabs(url, count = 1) {
    const tasks = [];
    for (let i = 0; i < count; i++) {
      tasks.push(browser.openTab(url));
    }
    return Promise.all(tasks);
  },
  clearHistory() {
    return BackgroundProxy.call('chrome.history.deleteAll');
  }
};
