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

exports.commands = {
  [seleniumCommand.Name.NEW_SESSION]: start,
  [seleniumCommand.Name.QUIT]: stop
};

function start() {
  TargetManager.reset();
  return TabLoader.create({})
    .then(tab => TargetManager.switchToTab(tab.id))
    .then(() => new seleniumSession.Session(SESSION_ID, {}));
}

function stop() {
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
