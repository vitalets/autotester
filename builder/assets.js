/**
 * Keep in sync assets in src and dist
 */

'use strict';

const sync = require('./sync');
const paths = require('./paths');

// todo:
// const manifestSyncer = new Syncer('src/manifest.json', paths.UNPACKED);
// + globbing support

exports.copy = function () {
  sync.copy('src/manifest.json', paths.UNPACKED);
  sync.copy('test/**', paths.UNPACKED + '/test');
  sync.copy('node_modules/mocha/mocha.js', paths.UNPACKED);
};

exports.watch = function () {
  sync.watch('src/manifest.json', paths.UNPACKED);
  sync.watch('test/**', paths.UNPACKED + '/test');
  sync.watch('node_modules/mocha/mocha.js', paths.UNPACKED);
};

// run from cli
if (!module.parent) {
  exports[process.argv[2]](process.argv[3]);
}
