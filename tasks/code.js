'use strict';

const {exec, config} = require('shelljs');
const status = require('./helper/status');

const onlyChanged = process.argv[2] === 'only-changed';

config.fatal = 1;
exec('madge --format=cjs --circular src');
exec('check-dependencies');

if (onlyChanged) {
  const changedJsFiles = status.getCachedChanges().filter(filename => /\.jsx?$/.test(filename));
  exec(`eslint ${changedJsFiles.join(' ')}`);
  console.log(`eslint ${changedJsFiles.length} file(s) done.`);
} else {
  const paths = ['src', 'test', 'tasks'];
  exec(`eslint ${paths.join(' ')}`);
  console.log(`eslint ${paths.join(' ')} done.`);
}
