'use strict';

const {exec} = require('shelljs');

exports.getBranch = function () {
  return exec('git rev-parse --abbrev-ref HEAD', {silent: true}).stdout.trim();
};

exports.getChanges = function () {
  return exec('git status --porcelain', {silent: true}).stdout.trim();
};

exports.ensureCleanBranch = function (branch) {
  const actualBranch = exports.getBranch();
  if (actualBranch !== branch && actualBranch !== 'HEAD') {
    console.log(`Invalid branch: ${actualBranch}, expected: ${branch}`);
    process.exit(1);
  }
  const changes = exports.getChanges();
  if (changes) {
    console.log('Dirty state:', changes);
    process.exit(1);
  }
};
