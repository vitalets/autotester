/**
 * Build unpacked extension with specified example
 */

"use strict";

const unpacked = require('./unpacked');
const zip = require('./zip');


const cmd = process.argv[2];

switch (cmd) {
  case 'unpacked':
    unpacked.create(process.argv[3]);
  break;
  case 'zip-google':
    unpacked.create('google');
    zip.createCli('dist/unpacked', 'dist/autotester-google.zip');
    break;
  default:
    console.log(`Unknown command: ${cmd}`)
}
