/**
 * Pack extension crx
 */

'use strict';

const Crx = require('crx');
const fs = require('fs-extra');

exports.pack = function (dir, key, out) {
  const crx = new Crx({
    privateKey: fs.readFileSync(key)
  });

  return crx.load(dir)
    .then(crx => crx.pack())
    .then(crxBuffer => {
      fs.writeFileSync(out, crxBuffer);
      console.log(`crx: packed ${dir} --> ${out}`);
    });
};
