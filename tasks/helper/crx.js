/**
 * Pack extension crx
 */

'use strict';

const Crx = require('crx');
const fs = require('fs-extra');
const path = require('path');

exports.pack = function ({dir, key, out}) {
  const crx = new Crx({
    privateKey: fs.readFileSync(key)
  });

  return crx.load(path.resolve(dir))
    .then(crx => crx.pack())
    .then(crxBuffer => {
      fs.writeFileSync(out, crxBuffer);
      console.log(`crx: packed ${dir} --> ${out}`);
    })
    .catch(e => {
      console.log(e);
      process.exit(1);
    })
};
