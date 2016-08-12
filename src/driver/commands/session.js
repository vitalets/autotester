/**
 * Session commands
 */

const Session = require('selenium-webdriver/lib/session').Session;

const TabLoader = require('../tab-loader');
const Targets = require('../targets');

// session id is constant as we have only one instance of chrome
const SESSION_ID = 'autotester-session';

exports.start = function () {
  Targets.reset();
  return TabLoader.create({})
    .then(tab => Targets.switchByProp('tabId', tab.id))
    .then(() => new Session(SESSION_ID, {}));
};

exports.stop = function () {
  return Targets.quit();
};
