/**
 * Evaluate methods
 */

/**
 * Evaluate code as commonJs module
 *
 * @param {String} code
 */
exports.asCommonJs = function (code) {
  const module = {exports: {}};
  const args = {
    module: module,
    exports: module.exports,
  };
  const fnCode = code + '\nreturn module;';
  return exports.asFunction(fnCode, args).exports;
};

/**
 * Evaluate code as anonymous function with specified arguments
 *
 * @param {String} code
 * @param {Object} [args]
 * @param {Object} [context]
 */
exports.asFunction = function (code, args = {}, context = null) {
  const argNames = Object.keys(args);
  const argValues = argNames.map(name => args[name]);
  const fn = new Function(argNames.join(','), code);
  return fn.apply(context, argValues);
};
