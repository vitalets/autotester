/**
 * Catch new tabs, get it's url and notify listeners
 * WebNavigation module is required to get url of new tab as tab.onCreated not always has it.
 */

const utils = require('../../utils');
const Channel = require('chnl');
const logger = require('../../utils/logger').create('Newtab catcher');

class NewTabCatcher {

  constructor() {
    this.onCatched = new Channel();
    this._tabs = new Set();
    this._onTabCreated = this._onTabCreated.bind(this);
    this._onBeforeNavigate = this._onBeforeNavigate.bind(this);
  }

  start() {
    this._tabs.clear();
    this._manageListeners('set');
  }

  stop() {
    this._manageListeners('unset');
  }

  _manageListeners(action) {
    utils.manageListener(chrome.tabs.onCreated, this._onTabCreated, action);
    utils.manageListener(chrome.webNavigation.onBeforeNavigate, this._onBeforeNavigate, action);
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
