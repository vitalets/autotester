/**
 * Prepare script for evaluation
 */

exports.asFunction = function (code) {
  // for some reason callFunctionOn converts {value: null} to undefined
  // todo: create issue
  // todo: remember arguments that are really null and transform only them,
  // todo: as in current case real undefined will be also converted to null
  return `function() {
    for (let i=0; i<arguments.length; i++) {
      if (arguments[i] === undefined) {
        arguments[i] = null;
      }
    }
    ${code}
  }`;
};

exports.asPromise = function (code) {
  // add `resolve` as last argument
  return `
    return new Promise(resolve => {
      [].push.call(arguments, resolve);
      ${code}
    });`;
};

exports.asSelfCallFunction = function (code) {
  return `(function() {
    ${code}
  }())`;
};
