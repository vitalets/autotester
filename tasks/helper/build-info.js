/**
 * Generates file with build information
 */

'use strict';

const path = require('path');
const fs = require('fs-extra');

exports.create = function (options) {
  const targetFile = path.join(options.outDir, 'core', 'build-info.js');
  const info = {
    timestamp: Date.now(),
    buildNumber: process.env.BUILD_NUMBER || '',
    hash: process.env.BUILD_VCS_NUMBER || '',
    isDev: Boolean(options.dev),
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

  const jsonStr = JSON.stringify(info, false, 2);
  const content = `window.__buildInfo = ${jsonStr};`;
  fs.outputFileSync(targetFile, content);
  console.log(`build-info: created ${targetFile}`);
};
