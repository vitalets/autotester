/**
 * Updates manifest of selftest version of autotester
 */

'use strict';

const path = require('path');
const cpx = require('cpx');
const fs = require('fs-extra');

const source = 'dist/unpacked-dev/**/!(*.map)';
const dest = 'dist/unpacked-dev-selftest/';
const manifestPath = path.join(dest, 'manifest.json');
const method = process.argv[2];
const options = {clean: true};

if (method === 'watch') {
  cpx.watch(source, dest, options)
    .on('copy', e => {
      console.log(`Copy ${e.srcPath} --> ${e.dstPath}`);
      if (e.dstPath === manifestPath) {
        updateManifest();
      }
    });
} else {
  cpx.copySync(source, dest, options);
  updateManifest();
}

/**
 * Update name and key in selftest version of Autotester to distinguish it from main.
 */
function updateManifest() {
  const manifest = fs.readJsonSync(manifestPath);
  manifest.name = `SELF TEST ${manifest.name}`;
  manifest.key = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoNcz4LvR5bPGLO6A9whCnxdfkX21YlAf5V12kgrR09Te7Rkm0SFgBpjvNCdDWN8bc1OpiKVMtiT6hArtr53pOrVB1UWA2YslBRxg18HizQxZB26edPI1gyTSrX59Dm4h0P5RuaKxHVJOVqldbe0Y1t5fCDLbiq0aPNlmvOnwV/Yk3gvJdA6N7slXvLR4/aNCekpvF/EYn7rs32LbWMSjYSTJ0b1OjrTRVNqGI3w97xLFNtqSHPvtrZ5OvWeDT4reqBhJ+xGbJFKKDUMLEq/fo3DJtGyLGywQoEtho4vRJO6WFNdAYjypxSSwryTYq+gL/MkQzL64guGZxYqp1M0p9QIDAQAB';
  fs.writeJsonSync(manifestPath, manifest);
}


