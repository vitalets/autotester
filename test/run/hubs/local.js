/**
 * Run on localhost
 */

'use strict';

const capabilities = require('../capabilities');

exports.name = 'local';
exports.capabilities = function () {
  return capabilities.get();
};
