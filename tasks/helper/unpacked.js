/**
 * Creates unpacked extension in specified dir
 */
'use strict';

const clean = require('./clean');
const copy = require('./copy');
const webpack = require('./webpack');

/**
 *
 * @param {String} outDir
 * @param {Boolean} [dev]
 * @param {Boolean} [watch]
 * @returns {Promise}
 */
exports.create = function ({outDir, dev, watch}) {
  clean.run(outDir);
  copy.core({outDir, dev, watch});
  if (dev) {
    copy.tests({outDir, watch});
  }
  return webpack.run({outDir, dev, watch}).catch(e => {
      console.log(e);
      process.exit(1);
    });
};
