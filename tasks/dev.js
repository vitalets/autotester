/**
 * Builds 2 unpacked versions of extension in `dist/unpacked-dev` and `dist/unpacked-mirror` for self testing.
 */
'use strict';

const unpacked = require('./helper/unpacked');

unpacked.create({
  outDir: 'dist/unpacked-dev',
  dev: true,
  watch: true,
});

unpacked.create({
  outDir: 'dist/unpacked-mirror',
  dev: false,
  watch: true,
});
