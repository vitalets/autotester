/**
 * Copy own selenium tests to be executed via autotester
 */
'use strict';

const fs = require('fs-extra');
const path = require('path');
const paths = require('./paths');

const srcDir = './node_modules/selenium-webdriver/test';
const destDir = path.join(paths.UNPACKED, '/test/selenium/');

const tests = [
  'tag_name_test.js'
];

fs.ensureDirSync(destDir);
tests.forEach(test => {
  console.log('copy:', test);
  fs.copySync(path.join(srcDir, test), path.join(destDir, test), {clobber: true})
});
