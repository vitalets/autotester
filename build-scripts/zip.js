"use strict";

const fs = require('fs');
const archiver = require('archiver');

exports.create = function (dir, outFile) {
  return new Promise((resolve, reject) => {
    const arch = archiver.create('zip', {});
    const out = fs.createWriteStream(outFile);
    console.log(`Creating zip: ${outFile}`);
    out.on('close', resolve);
    arch.on('error', e => {
      console.log(e);
      reject(e);
    });
    arch.pipe(out);
    arch.directory(dir, '.');
    arch.finalize();
  });
};
