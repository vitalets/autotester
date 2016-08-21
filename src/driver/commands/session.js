/**
 * Session commands
 */

const Session = require('selenium-webdriver/lib/session').Session;
const Targets = require('../targets');
const switchTo = require('./switch-to');

// session id is constant as we have only one instance of chrome
const SESSION_ID = 'autotester-session';

exports.start = function () {
  Targets.reset();
  return switchTo.newTab()
    .then(() => new Session(SESSION_ID, {}));
};

exports.stop = function () {
  return Targets.quit();
};
