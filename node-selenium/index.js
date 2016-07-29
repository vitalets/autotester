'use strict';

const path = require('path');
const Mocha = require('mocha');
const tests = require('../test');

const mocha = new Mocha({
  ui: 'bdd',
  timeout: 60 * 1000
});

// add setup file to set globals
mocha.addFile(path.resolve(__dirname, './prepare.js'));

tests.forEach(test => mocha.addFile(test));

mocha.run(failures => {
  // console.log('Finish', failures);
  process.on('exit', () => {
    process.exit(failures);
  });
});
