/**
 * Copy libs from node-modules to core/libs
 * This is needed to run extension from src without installing node
 */

"use strict";

const fs = require('fs-extra');
const path = require('path');

exports.run = function () {
  const libs = [
    'node_modules/mocha/mocha.js',
    'node_modules/mocha/mocha.css',
    'node_modules/chai/chai.js'
  ];
  const destDir = 'src/core/libs/';
  libs.forEach(srcPath => {
    const destPath = destDir + path.basename(srcPath);
    fs.copySync(srcPath, destPath, {clobber: true});
    console.log(`Copied: ${srcPath} --> ${destPath}`);
  });
};
