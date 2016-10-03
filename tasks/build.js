'use strict';

const status = require('./helper/status');
const clean = require('./helper/clean');
const copy = require('./helper/copy');
const webpack = require('./helper/webpack');
const buildInfo = require('./helper/build-info');
const zip = require('./helper/zip');
const crx = require('./helper/crx');

const outDir = 'dist/unpacked';

//ensureCleanBranch('shelljs');
clean.run(outDir);
buildInfo.create({outDir});
copy.core({outDir});
webpack.run({outDir})
  .then(() => {
    zip.create({dir: outDir, out: '../autotester.zip'});
    crx.pack(outDir, 'tasks/keys/autotester.pem', 'dist/autotester.crx');
    crx.pack('dist/unpacked-dev', 'tasks/keys/autotester-dev.pem', 'dist/autotester-dev.crx');
  })
  .catch(e => {
    console.log(e);
    process.exit(1);
  });

function ensureCleanBranch(branch) {
  if (status.getBranch() !== branch) {
    console.log(`Invalid branch: ${status.getBranch()}, expected: ${branch}`);
    process.exit(1);
  }
  if (status.getChanges()) {
    console.log('Dirty state:', status.getChanges());
    process.exit(1);
  }
}
