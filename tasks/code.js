'use strict';

const {exec, config} = require('shelljs');
const status = require('./helper/status');

const onlyChanged = process.argv[2] === 'only-changed';

config.fatal = 1;
exec('madge --format=cjs --circular src');
exec('check-dependencies');
if (onlyChanged) {
  checkOnlyInTests();
  eslintChanged();
} else {
  eslintAll();
}

function checkOnlyInTests() {
  // todo: use eslint-plugin-mocha https://github.com/lo1tuma/eslint-plugin-mocha/issues/102
  const lines = exec('git diff --cached -- "test/**/*.js"', {silent: true}).stdout.split('\n');
  const linesWithOnly = lines.filter(line => /^\+.*\.only/.test(line));
  if (linesWithOnly.length) {
    console.log('.only in tests!');
    console.log(linesWithOnly.join('\n'));
    process.exit(1);
  }
}

function eslintChanged() {
  const changedJsFiles = status.getCachedChanges().filter(filename => /\.jsx?$/.test(filename));
  if (changedJsFiles.length) {
    exec(`eslint ${changedJsFiles.join(' ')}`);
    console.log(`eslint: ${changedJsFiles.length} file(s) linted.`);
  } else {
    console.log(`eslint: nothing to lint.`);
  }
}

function eslintAll() {
  const paths = ['src', 'test', 'tasks'];
  exec(`eslint ${paths.join(' ')}`);
  console.log(`eslint: all linted.`);
}
