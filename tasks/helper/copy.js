'use strict';

const path = require('path');
const cpx = require('cpx');
const fs = require('fs-extra');
const noop = function () {};

exports.core = function (options) {
  const onManifestCopy = options.dev ? updateDevManifest : null;
  processItems([
    {src: 'src/manifest.json', dest: `${options.outDir}/`, onCopy: onManifestCopy},
    {src: 'src/ui/ui.html', dest: `${options.outDir}/core/ui/`},
    {src: 'node_modules/mocha/mocha.js', dest: `${options.outDir}/core/background/`},
  ], options);
};

exports.tests = function (options) {
  processItems([
    {src: 'test/specs/**', dest: `${options.outDir}/tests/`},
  ], options);
};

function processItems(items, options = {}) {
  items.forEach(item => {
    console.log(`copy${options.watch ? ' and watch' : ''}: ${item.src} --> ${item.dest}`);
    item.onCopy = item.onCopy || noop;
    copy(item);
    if (options.watch) {
      watch(item);
    }
  });
}

function copy(item) {
  cpx.copySync(item.src, item.dest, {clean: true});
  item.onCopy(item);
}

function watch(item) {
  cpx.watch(item.src, item.dest, {initialCopy: false})
    .on('copy', e => {
      console.log(`copy: ${e.srcPath} --> ${e.dstPath}`);
      item.onCopy(item);
    });
}

/**
 * Update dev manifest key to have different extension id
 */
function updateDevManifest(item) {
  const relPath = path.join(item.dest, path.basename(item.src));
  updateJsonFile(relPath, {
    name: 'DEV Autotester',
    // id = inilfehdbldcjcffbakeabignfomfbdh
    key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoNcz4LvR5bPGLO6A9whCnxdfkX21YlAf5V12kgrR09Te7Rkm0SFgBpjvNCdDWN8bc1OpiKVMtiT6hArtr53pOrVB1UWA2YslBRxg18HizQxZB26edPI1gyTSrX59Dm4h0P5RuaKxHVJOVqldbe0Y1t5fCDLbiq0aPNlmvOnwV/Yk3gvJdA6N7slXvLR4/aNCekpvF/EYn7rs32LbWMSjYSTJ0b1OjrTRVNqGI3w97xLFNtqSHPvtrZ5OvWeDT4reqBhJ+xGbJFKKDUMLEq/fo3DJtGyLGywQoEtho4vRJO6WFNdAYjypxSSwryTYq+gL/MkQzL64guGZxYqp1M0p9QIDAQAB'
  });
}

function updateJsonFile(relPath, data) {
  const absPath = path.resolve(relPath);
  const json = fs.readJsonSync(absPath);
  Object.assign(json, data);
  fs.writeJsonSync(absPath, json);
}
