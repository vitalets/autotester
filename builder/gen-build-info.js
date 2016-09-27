/**
 * Generates file with build information
 */

'use strict';

const path = require('path');
const fs = require('fs-extra');

const targetFile = path.join(process.env.npm_config_outdir, 'core', 'build-info.js');
const info = {
  timestamp: Date.now(),
  buildNumber: process.env.BUILD_NUMBER || '',
  hash: process.env.BUILD_VCS_NUMBER || '',
  isDev: Boolean(process.env.AUTOTESTER_DEV_BUILD),
};

// add yandex info if exists
if (process.env.YANDEX_USER) {
  info.yandexUser = process.env.YANDEX_USER;
  info.yandexKey = process.env.YANDEX_KEY;
}

// add sauce info if exists
if (process.env.SAUCE_USER) {
  info.sauceUser = process.env.SAUCE_USER;
  info.sauceKey = process.env.SAUCE_KEY;
}

const content = 'window.__buildInfo = ' + JSON.stringify(info, false, 2) + ';';
fs.outputFileSync(targetFile, content);
console.log(`Generated: ${targetFile}`);
console.log(content);
