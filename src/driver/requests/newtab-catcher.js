/**
 * Catch new tabs, get it's url and notify listeners
 * WebNavigation module is required to get url of new tab as tab.onCreated not always has it.
 */

const ListenerSwitch = require('../../utils/listener-switch');
const Channel = require('chnl');

class NewTabCatcher {

  constructor() {
    this.onCatched = new Channel();
    this._tabs = new Set();
    this._listenerSwitch = new ListenerSwitch([
      [chrome.tabs.onCreated, this._onTabCreated],
      [chrome.webNavigation.onBeforeNavigate, this._onBeforeNavigate],
    ], this);
  }

  start() {
    this._tabs.clear();
    this._listenerSwitch.on();
  }

  stop() {
    this._listenerSwitch.off();
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
