/**
 * Utils
 */
'use strict';

/**
 * Ensures node >= 6.
 * Engines field in package.json does not work as it is for another thing.
 * See: http://www.marcusoft.net/2015/03/packagejson-and-engines-and-enginestrict.html
 */
exports.ensureNode6 = function () {
  if (!process.version.match(/v6|v7/)) {
    throw new Error(`Node version >= 6 required. You have ${process.version}`);
  }
};
