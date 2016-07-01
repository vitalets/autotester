
window.fiddler = {
  /**
   * Set targets
   * @param {Object} targets
   * @param {Boolean} targets.devtools
   * @param {String} targets.extensionId
   * @param {String} targets.tabId
   */
  setTargets(targets = {}) {
    const catchers = [];
    if (targets.devtools) {
      this.devtoolsCatcher = this.devtoolsCatcher || new DevtoolsRequestCatcher();
      catchers.push(this.devtoolsCatcher);
    }
    if (targets.extensionId) {
      this.extensionBgCatcher = this.extensionBgCatcher || new BgRequestCatcher('debuggerBgRequestCatcher');
      this.extensionBgCatcher.setTarget({extensionId: targets.extensionId});
      catchers.push(this.extensionBgCatcher);
    }
    if (typeof targets.tabId === 'number') {
      // requests from extension tab can be catched only with debugger
      // although other tabs can be catched with webrequest
      const name = targets.extensionId ? 'debuggerTabRequestCatcher' : 'webRequestCatcher';
      this[name] = this[name] || new BgRequestCatcher(name);
      this[name].setTarget({tabId: targets.tabId});
      catchers.push(this[name]);
    }
    this._collector = new RequestCollector(catchers);
  },

  start() {
    // console.log('fiddler start');
    return this._collector.start();
  },

  stop() {
    // console.log('fiddler stop');
    return this._collector.stop();
  },

  assert(filter, count = 1) {
    const filtered = this._collector.getRequests(filter);
    const filterStr = JSON.stringify(filter, false, 2);
    if (filtered.length === count) {
      assert.equal(filtered.length, count, `Request matched for ${filterStr}`);
    } else {
      const msg = `Requests not matched for ${filterStr} \n ${this._collector.getRequestsAsString()}`;
      assert.equal(filtered.length, count, msg);
    }
  }
};

/**
 * Wrapper for background catchers via BackgroundProxy calls
 */
class BgRequestCatcher {
  constructor(name) {
    this.name = name;
  }
  setTarget(target) {
    return BackgroundProxy.call(`${this.name}.setTarget`, target);
  }
  start() {
    return BackgroundProxy.call({
      path: `${this.name}.start`,
      promise: true
    });
  }
  stop() {
    return BackgroundProxy.call(`${this.name}.stop`);
  }
}
