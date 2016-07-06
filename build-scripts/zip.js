"use strict";

const fs = require('fs-extra');
// zip files created by this module are not extractable window default uncompress folder command
// see: https://github.com/archiverjs/node-archiver/issues/196
const archiver = require('archiver');
const exec = require('child_process').exec;

exports.create = function (dir, outFile) {
  fs.removeSync(outFile);
  return new Promise((resolve, reject) => {
    const arch = archiver.create('zip', {});
    const out = fs.createWriteStream(outFile);
    out.on('close', () => {
      console.log(`Created zip: ${outFile} from ${dir}`);
    });
    arch.on('error', e => {
      console.log(e);
      reject(e);
    });
    arch.pipe(out);
    arch.directory(dir, '.');
    arch.finalize();
  });
};

exports.createCli = function (dir, outFile) {
  return new Promise((resolve, reject) => {
    exec('zip -r ../autotester-google.zip .', {cwd: 'dist/unpacked'}, function (error) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log(`Created zip: ${outFile} from ${dir}`);
        resolve();
      }
    });
  });
};
