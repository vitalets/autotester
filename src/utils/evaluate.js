/**
 * Evaluate methods
 */

/**
 * Evaluate code as commonJs module
 * Filename is required as otherwise you will not be able to debug code (<anonymous> in stack trace)
 *
 * @param {String} filename
 * @param {String} code
 */
exports.asCommonJs = function (filename, code) {
  const module = {exports: {}};
  const args = {
    module: module,
    exports: module.exports,
  };
  const fnCode = code + '\nreturn module;';
  return exports.asFunction(filename, fnCode, args).exports;
};

/**
 * Evaluate code as anonymous function with specified arguments
 * Filename is required as otherwise you will not be able to debug code (<anonymous> in stack trace)
 *
 * @param {String} filename
 * @param {String} code
 * @param {Object} [args]
 * @param {Object} [context]
 */
exports.asFunction = function (filename, code, args = {}, context = null) {
  const argNames = Object.keys(args);
  const argValues = argNames.map(name => args[name]);
  const fn = new Function(argNames.join(','), code);
  // for pretty debugging
  Object.defineProperty(fn, 'name', {value: filename});
  return fn.apply(context, argValues);
};
