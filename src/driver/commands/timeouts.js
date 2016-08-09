/**
 * Commands for managing timeouts
 * http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_Timeouts.html
 */

const TargetManager = require('../target-manager');

const TYPES = [
  'script',
  'page load',
];

/**
 * Set timeout for some type
 *
 * @param {Object} params
 * @param {String} params.type
 * @param {Number} params.ms
 */
exports.setTimeout = function (params) {
  return Promise.resolve();
};
