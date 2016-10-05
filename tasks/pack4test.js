/**
 * Packs 2 crx for self testing
 */
'use strict';

const crx = require('./helper/crx');

crx.pack({
  dir: 'dist/unpacked-dev',
  key: 'tasks/keys/autotester-dev.pem',
  out: 'dist/autotester-dev.crx',
});

crx.pack({
  dir: 'dist/unpacked',
  key: 'tasks/keys/autotester.pem',
  out: 'dist/autotester.crx',
});
