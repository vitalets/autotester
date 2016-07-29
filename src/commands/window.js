/**
 * Commands to get info and manipulate window(s) and tabs(s)
 * For selenium window === tab.
 */

const TargetManager = require('../target-manager');

exports.getCurrentWindowHandle = function () {
  return Promise.resolve(TargetManager.handle);
};

exports.getAllWindowHandles = function () {
  return Promise.resolve()
    .then(() => TargetManager.getAllTargets())
    .then(targets => targets.map(target => target.handle));
};
