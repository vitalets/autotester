/**
 * Keep in sync files/directories from src to dist
 */

'use strict';

const fs = require('fs-extra');
const path = require('path');
const gaze = require('gaze');
const paths = require('./paths');

const DEST = paths.UNPACKED;

exports.copy = function (src) {
  if (!src) {
    throw new Error('Empty src');
  }
  const dest = path.join(DEST, path.basename(src));
  fs.copySync(src, dest, {clobber: true});
  console.log(`Copy: ${src} --> ${dest}`);
};

exports.watch = function (src) {
  gaze(src, function () {
    this.on('all', () => exports.copy(src));
  });
};

// run from cli
if (!module.parent) {
  exports[process.argv[2]](process.argv[3]);
}
