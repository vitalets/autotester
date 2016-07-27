/**
 * Session commands
 */

const seleniumCommand = require('selenium-webdriver/lib/command');
const seleniumSession = require('selenium-webdriver/lib/session');

const TabLoader = require('../tab-loader');
const TargetManager = require('../target-manager');
const switchCommand = require('./switch');

// session id is constant as we have only one instance of chrome
const SESSION_ID = 'autotester-session';

exports.commands = {
  [seleniumCommand.Name.NEW_SESSION]: start,
  [seleniumCommand.Name.QUIT]: stop
};

function start() {
  TargetManager.reset();
  return TabLoader.create({})
    .then(tab => switchCommand.switchByTabId(tab.id))
    .then(() => new seleniumSession.Session(SESSION_ID, {}));
}

function stop() {
  return TargetManager.quit();
}
