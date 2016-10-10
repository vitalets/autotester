/**
 * Catch new tabs, get it's url and notify listeners
 * WebNavigation module is required to get url of new tab as tab.onCreated not always has it.
 */

const Channel = require('chnl');

class NewTabCatcher {

  constructor() {
    this.onCatched = new Channel();
    this._tabs = new Set();
    this._listeners = new Channel.Subscription([
      {
        channel: chrome.tabs.onCreated,
        listener: this._onTabCreated.bind(this)
      },
      {
        channel: chrome.webNavigation.onBeforeNavigate,
        listener: this._onBeforeNavigate.bind(this)
      },
    ]);
  }

  start() {
    this._tabs.clear();
    this._listeners.on();
  }

  stop() {
    this._listeners.off();
  }

  _onTabCreated(tab) {
    this._tabs.add(tab.id);
  }

  _onBeforeNavigate(info) {
    if (info.frameId === 0 && this._tabs.has(info.tabId)) {
      this._tabs.delete(info.tabId);
      const eventData = {
        tabId: info.tabId,
        url: info.url,
      };
      this.onCatched.dispatch(eventData);
    }
  }
}

module.exports = NewTabCatcher;
