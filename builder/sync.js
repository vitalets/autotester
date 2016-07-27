/**
 * Keep in sync files/directories in two dirs (usually src --> dist)
 */

'use strict';

const fs = require('fs-extra');
const path = require('path');
const gaze = require('gaze');
const globule = require('globule');

exports.copy = function (src, dest) {
  const filepaths = globule.find(src, {filter: 'isFile'});
  filepaths.forEach(filepath => copyFile(filepath, dest));
};

exports.watch = function (src, dest) {
  // copy all before watch
  exports.copy(src, dest);
  gaze(src, function () {
    this.on('changed', filepath => copyFile(filepath, dest));
    this.on('added', filepath => copyFile(filepath, dest));
    this.on('deleted', filepath => removeFile(filepath, dest));
  });
};

// todo: support nested dirs otherwise they will be flattern!
function copyFile(filepath, dest) {
  const destFilepath = getDestFilepath(filepath, dest);
  fs.copySync(filepath, destFilepath, {clobber: true});
  console.log(`Copy: ${filepath} --> ${destFilepath}`);
}

function removeFile(filepath, dest) {
  const destFilepath = getDestFilepath(filepath, dest);
  fs.removeSync(destFilepath);
  console.log(`Remove: ${destFilepath}`);
}

function getDestFilepath(filepath, dest) {
  return path.join(dest, path.basename(filepath));
}

// run from cli
if (!module.parent) {
  exports[process.argv[2]](process.argv[3]);
}
