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
 * Replaces <anonymous> with filename in stack trace
 *
 * @param {Error} error
 * @param {String} filename
 */
exports.fixStack = function (error, filename) {
  const stack = error.stack;
  // sometimes we get object with only message filed instead of Error instance
  if (!stack) {
    return;
  }
  const stackLines = stack.split('\n');
  const newStack = [];
  const regexp = /\, <anonymous>:(\d+):(\d+)/;
  let found = false;
  stackLines.forEach((line, index) => {
    if (!found) {
      const matches = line.match(regexp);
      if (matches) {
        found = true;
        const row = matches[1] - 2; // eval stack has extra 2 rows for `function() { ...`
        const col = matches[2];
        newStack.push(`    at eval (${filename}:${row}:${col})`);
        line = line.replace(regexp, '');
      }
    }
    newStack.push(line);
  });
  error.stack = newStack.join('\n');
};
