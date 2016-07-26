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
  const dest = getDestPath(src);
  fs.copySync(src, dest, {clobber: true});
  console.log(`Copy: ${src} --> ${dest}`);
};

exports.watch = function (src) {
  gaze(src, function () {
    this.on('changed', exports.copy);
    this.on('added', exports.copy);
    this.on('deleted', function (filepath) {
      const dest = getDestPath(filepath);
      fs.removeSync(dest);
      console.log(`Remove: ${dest}`);
    });
  });
};

function getDestPath(srcPath) {
  const relPath = path.relative(process.cwd(), srcPath);
  return path.join(DEST, relPath);
}

// run from cli
if (!module.parent) {
  exports[process.argv[2]](process.argv[3]);
}
