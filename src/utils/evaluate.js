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

/**
 * Creates error message with specified filename and row:col link
 * using existing thrown error
 *
 * @param {Error} error
 * @param {String} filename
 */
exports.getErrorMessage = function (error, filename = '<anonymous>') {
  const stack = error.stack.split('\n');
  let msg = `${stack[0]}\n      at ${filename}`;
  // take row/col from <anonymous> part of stack
  const matches = stack[1].match(/<anonymous>:(\d+):(\d+)/);
  if (matches) {
    const row = matches[1] - 2; // eval stack has extra 2 rows for `function() { ...`
    const col = matches[2];
    msg += `:${row}:${col}`;
  }
  return msg;
};
