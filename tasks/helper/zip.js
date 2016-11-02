/**
 * Use cli zip instead of node.js implementations (e.g. adm-zip) because such archives can be
 * extracted via windows default `extract` context-menu command.
 *
 * See: https://github.com/archiverjs/node-archiver/issues/196
 */

'use strict';

const {pushd, exec, popd} = require('shelljs');

exports.create = function ({dir, out}) {
  pushd(dir);
  if (process.env.APPVEYOR) {
    exec(`7z a -r ${out} .`);
  } else {
    exec(`zip -rT ${out} .`);
  }
  popd();
};
