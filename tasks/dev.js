/**
 * Builds 2 unpacked versions of extension in `dist/unpacked-dev` and `dist/unpacked` for self testing.
 */
'use strict';

require('./helper/utils').ensureNode6();

const unpacked = require('./helper/unpacked');

unpacked.create({
  outDir: 'dist/unpacked-dev',
  dev: true,
  watch: true,
});

unpacked.create({
  outDir: 'dist/unpacked',
  dev: false,
  watch: true,
});
