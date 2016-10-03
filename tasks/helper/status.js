'use strict';

const {exec} = require('shelljs');

exports.getBranch = function () {
  return exec('git rev-parse --abbrev-ref HEAD', {silent: true}).stdout.trim();
};

exports.getChanges = function () {
  return exec('git status --porcelain', {silent: true}).stdout.trim();
};
