/**
 * Evaluate methods
 */

/**
 * Evals code as commonJs module
 *
 * @param {String} code
 */
exports.asCommonJs = function (code) {
  const wrapped = `(function(module, exports = module.exports) {
        ${code}
        return module;
      })({exports: {}})`;
  return window.eval(wrapped).exports;
};

/**
 * Evals code as anonymous function
 *
 * @param {String} code
 */
exports.asAnonymousFn = function (code) {
  const wrapped = `(function() {
        ${code}
      })()`;
  return window.eval(wrapped);
};
