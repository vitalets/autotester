/**
 * Session commands
 */

const Targets = require('../targets');
const switchTo = require('./switch-to');

exports.newSession = function () {
  return Promise.resolve()
    .then(() => Targets.reset())
    .then(() => switchTo.newTab())
    .then(() => {});
};

exports.deleteSession = function () {
  return Targets.quit();
};
