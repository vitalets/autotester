'use strict';

const {exec} = require('shelljs');

exports.getBranch = function () {
  return exec('git rev-parse --abbrev-ref HEAD', {silent: true}).stdout.trim();
};

exports.getChanges = function () {
  return exec('git status --porcelain', {silent: true}).stdout.trim();
};

exports.ensureCleanBranch = function (branch) {
  if (exports.getBranch() !== branch) {
    console.log(`Invalid branch: ${exports.getBranch()}, expected: ${branch}`);
    process.exit(1);
  }
  if (exports.getChanges()) {
    console.log('Dirty state:', exports.getChanges());
    process.exit(1);
  }
};
