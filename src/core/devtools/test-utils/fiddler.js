
window.fiddler = {
  start() {
    return page.getUrl()
      .then(url => {
        const extensionId = extension.getIdFromUrl(url);
        return extensionId ? this._attachToExtension(extensionId) : this._attachToWebPage();
      })
      .then(() => this._collector.start());
  },

  stop() {
    return this._collector && this._collector.stop() || Promise.resolve();
  },

  assert(filter, count = 1) {
    const filtered = this._collector.getRequests(filter);
    const filterStr = JSON.stringify(filter, false, 2);
    if (filtered.length === count) {
      assert.equal(filtered.length, count, `Request matched for ${filterStr}`);
    } else {
      const msg = `Requests not matched for ${filterStr}\n${this._collector.getRequestsAsString()}`;
      assert.equal(filtered.length, count, msg);
    }
  },

  _attachToExtension(extensionId) {
    console.log(`attach to extension ${extensionId}`);
    this.devtoolsCatcher = this.devtoolsCatcher || new DevtoolsRequestCatcher();
    this.extensionBgCatcher = this.extensionBgCatcher || new BgRequestCatcher('debuggerBgRequestCatcher');
    const tasks = [
      this.devtoolsCatcher.attach(),
      this.extensionBgCatcher.attach({extensionId})
    ];
    return Promise.all(tasks)
      .then(() => this._collector = new RequestCollector([
        this.devtoolsCatcher,
        this.extensionBgCatcher
      ]), e => {
        if (typeof e === 'string' && e.indexOf('Cannot access a chrome-extension:// URL of different extension') > 0) {
          const msg = 'You are trying to catch http requests of another extension. ' +
          'To allow it you should enable 2 chrome flags:\n' +
          '  --silent-debugger-extension-api\n' +
          '  --extensions-on-chrome-urls\n' +
          '<a href="#" id="enable-flags">Click here to enable these flags automatically and restart chrome</a>';
          infoblock.error(msg);
          return Promise.reject(msg);
        } else {
          return Promise.reject(e);
        }
      });
  },
  _attachToWebPage() {
    console.log(`attach to web page`);
    this.webRequestCatcher = this.webRequestCatcher || new BgRequestCatcher('webRequestCatcher');
    return this.webRequestCatcher.attach({tabId: chrome.devtools.inspectedWindow.tabId})
      .then(() => this._collector = new RequestCollector([this.webRequestCatcher]));
  }
};

/**
 * Wrapper for background catchers via BackgroundProxy calls
 */
class BgRequestCatcher {
  constructor(name) {
    this.name = name;
  }
  attach(target) {
    return BackgroundProxy.call({
      path: `${this.name}.attach`,
      args: [target],
      promise: true
    });
  }
  start(filter) {
    return BackgroundProxy.call({
      path: `${this.name}.start`,
      args: [filter],
      promise: true
    });
  }
  stop() {
    return BackgroundProxy.call(`${this.name}.stop`);
  }
}
