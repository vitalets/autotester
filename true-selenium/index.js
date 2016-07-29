'use strict';

const Mocha = require('mocha');
const files = require('./files');

const mocha = new Mocha({
  ui: 'bdd',
  timeout: 60 * 1000
});

mocha.addFile('true-selenium/prepare.js');

files.forEach(file => mocha.addFile(file));

mocha.run(failures => {
  // console.log('Finish', failures);
  process.on('exit', () => {
    process.exit(failures);
  });
});
