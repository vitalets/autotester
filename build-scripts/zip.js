"use strict";

const fs = require('fs-extra');
const archiver = require('archiver');

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
