'use strict';

const {rm} = require('shelljs');

exports.run = function (dir) {
  console.log(`clean: ${dir}`);
  rm('-rf', dir);
};
