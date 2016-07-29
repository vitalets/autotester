/**
 * Session commands
 */

const Session = require('selenium-webdriver/lib/session').Session;

const TabLoader = require('../tab-loader');
const TargetManager = require('../target-manager');

// session id is constant as we have only one instance of chrome
const SESSION_ID = 'autotester-session';

exports.start = function () {
  TargetManager.reset();
  return TabLoader.create({})
    .then(tab => TargetManager.switchByProp('tabId', tab.id))
    .then(() => new Session(SESSION_ID, {}));
};

exports.stop = function () {
  return TargetManager.quit();
};
