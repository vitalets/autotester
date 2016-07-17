/**
 * Watch and copy manifest to unpacked
 */

'use strict';

const fs = require('fs-extra');
const path = require('path');
const gaze = require('gaze');
const paths = require('./paths');

const SRC_FILE = 'src/manifest.json';

exports.copy = function () {
  const destPath = path.join(paths.UNPACKED, path.basename(SRC_FILE));
  fs.copySync(SRC_FILE, destPath, {clobber: true});
  console.log(`Copy manifest: ${SRC_FILE} --> ${destPath}`);
};

exports.watch = function () {
  gaze(SRC_FILE, function () {
    this.on('all', exports.copy);
  });
};

// run from cli
if (!module.parent) {
  exports[process.argv[2]]();
}
