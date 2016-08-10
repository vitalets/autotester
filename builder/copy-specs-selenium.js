/**
 * Copy own selenium specs from './node_modules/selenium-webdriver/test' to 'test/specs-selenium'
 * This is rare task called when we want to support new selenium own test-files
 */
'use strict';

const fs = require('fs-extra');
const path = require('path');
const paths = require('./paths');
const tests = require('../test').tests;

const srcDir = './node_modules/selenium-webdriver/test';
const destDir = './test/specs-selenium/';

fs.ensureDirSync(destDir);
tests
  .filter(test => test.indexOf('specs-selenium/') >= 0)
  .forEach(test => {
    // todo: copy with subfolders (not needed now)
    const filename = path.basename(test);
    const srcFile = path.join(srcDir, filename);
    const destFile = path.join(destDir, filename);
    fs.copySync(srcFile, destFile, {clobber: true});
    console.log(`Copied: ${srcFile} --> ${destFile}`);
  });
