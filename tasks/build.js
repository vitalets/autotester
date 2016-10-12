/**
 * Creates 2 builds from current master branch: dev and prod
 */

'use strict';

const unpacked = require('./helper/unpacked');
const crx = require('./helper/crx');
const zip = require('./helper/zip');

const outDir = 'dist/unpacked-master';
const outDirDev = 'dist/unpacked-master-dev';

Promise.all([
  unpacked.create({
    outDir: outDir,
    dev: false
  }),
  unpacked.create({
    outDir: outDirDev,
    dev: true
  }),
])
.then(() => {
  zip.create({
    dir: outDir,
    out: '../autotester.zip'
  });
  crx.pack({
    dir: outDir,
    key: 'tasks/keys/autotester.pem',
    out: 'dist/autotester.crx'
  });
  crx.pack({
    dir: outDirDev,
    key: 'tasks/keys/autotester-dev.pem',
    out: 'dist/autotester-dev.crx'
  });
});
