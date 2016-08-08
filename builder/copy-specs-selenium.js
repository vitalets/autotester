/**
 * Copy own selenium specs to be executed via autotester
 */
'use strict';

const fs = require('fs-extra');
const path = require('path');
const paths = require('./paths');

const srcDir = './node_modules/selenium-webdriver/test';
const destDir = path.join(paths.UNPACKED, '/test/specs-selenium/');

const tests = [
  'tag_name_test.js',
  'element_finding_test.js',
  'actions_test.js',
  'execute_script_test.js',
];

fs.ensureDirSync(destDir);
tests.forEach(test => {
  const srcFile = path.join(srcDir, test);
  const destFile = path.join(destDir, test);
  fs.copySync(srcFile, destFile, {clobber: true});
  console.log(`Copied: ${srcFile} --> ${destFile}`);
});
