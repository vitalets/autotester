/**
 * Commands to get info and manipulate window(s) and tabs(s)
 * For selenium window === tab.
 */

const Targets = require('../targets');

exports.getCurrentWindowHandle = function () {
  return Promise.resolve(Targets.handle);
};

exports.getAllWindowHandles = function () {
  return Promise.resolve()
    .then(() => Targets.getAllTargets())
    .then(targets => targets.map(target => target.handle));
};
