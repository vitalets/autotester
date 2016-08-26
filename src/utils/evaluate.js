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

/**
 * Replaces first <anonymous> eval with filename in stack trace
 * Not used now as we name evaled function as filename
 *
 * before:
 * at Context.eval (eval at <anonymous> (bundle.js:809:15), <anonymous>:81:6)
 *
 * after:
 * at path/filename.js:79:6)
 * at Context.eval (eval at <anonymous> (bundle.js:809:15), <anonymous>:81:6)
 *
 * @param {Error|Object} error
 * @param {String} filename
 */
exports.fixStack = function (error, filename) {
  const stack = error.stack;

  // sometimes we get object with only message instead of Error instance
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
  if (found) {
    error.stack = newStack.join('\n');
  }
};
