'use strict';

const fs = require('fs-extra');
const path = require('path');
// zip files created by this module are not extractable window default uncompress folder command
// see: https://github.com/archiverjs/node-archiver/issues/196
const archiver = require('archiver');
const exec = require('child_process').exec;

exports.create = function (dir, outFile) {
  fs.removeSync(outFile);
  return createCli(dir, outFile)
    .then(() => console.log(`Created zip: ${outFile} from ${dir}`))
    .catch(e => {
      console.log(e);
      throw e;
    });
};


function createArchiver() {
  return new Promise((resolve, reject) => {
    const arch = archiver.create('zip', {});
    const out = fs.createWriteStream(outFile);
    out.on('close', resolve);
    arch.on('error', reject);
    arch.pipe(out);
    arch.directory(dir, '.');
    arch.finalize();
  });
}

function createCli(dir, outFile) {
  return new Promise((resolve, reject) => {
    const relPath = path.relative(dir, outFile);
    exec(`zip -r ${relPath} .`, {cwd: dir}, error => error ? reject(error) : resolve());
  });
}
