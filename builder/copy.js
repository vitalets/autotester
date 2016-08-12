/**
 * Copy some files manually
 */
'use strict';

const fs = require('fs-extra');
const path = require('path');

exports.seleniumTests = function () {
  const srcDir = './node_modules/selenium-webdriver/test';
  const destDir = './test/specs-selenium/';
  const files = require('../test').tests
    .filter(file => file.indexOf('specs-selenium/') >= 0)
    .map(file => path.basename(file));
  copyFiles(srcDir, destDir, files);
};

exports.seleniumExamples = function () {
  const srcDir = './node_modules/selenium-webdriver/example/';
  const destDir = './examples/from-selenium/';
  const files = [
    'google_search.js',
    'google_search_test.js',
  ];
  copyFiles(srcDir, destDir, files);
};

function copyFiles(srcDir, destDir, files) {
  fs.ensureDirSync(destDir);
  files.forEach(filepath => {
    const srcFile = path.join(srcDir, filepath);
    const destFile = path.join(destDir, filepath);
    fs.copySync(srcFile, destFile, {clobber: true});
    console.log(`Copied: ${srcFile} --> ${destFile}`);
  });
}

// run from cli
if (!module.parent) {
  exports[process.argv[2]]();
}
