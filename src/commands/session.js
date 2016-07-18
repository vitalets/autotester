/**
 * Session commands
 */

const seleniumCommand = require('selenium-webdriver/lib/command');
const seleniumSession = require('selenium-webdriver/lib/session');
const thenChrome = require('then-chrome');

const TabLoader = require('../tab-loader');
const TargetManager = require('../target-manager');

// session id is constant as we have only one instance of chrome
const SESSION_ID = 'autotester-session';

class Session {
  static start() {
    TargetManager.reset();
    return TabLoader.create({})
      .then(tab => TargetManager.switchToTab(tab.id))
      .then(() => new seleniumSession.Session(SESSION_ID, {}));
  }
  static stop() {
    const tasks = TargetManager.debuggers.map(d => {
      return d.detach()
        .then(() => {
          const tabId = d.getTarget().tabId;
          if (tabId) {
            return thenChrome.tabs.remove(tabId);
          }
        });
    });
    return Promise.all(tasks);
  }
  static exports() {
    return {
      [seleniumCommand.Name.NEW_SESSION]: Session.start,
      [seleniumCommand.Name.QUIT]: Session.stop
    }
  }
}

module.exports = Session;
