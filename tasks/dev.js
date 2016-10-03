'use strict';

const clean = require('./helper/clean');
const copy = require('./helper/copy');
const webpack = require('./helper/webpack');
const buildInfo = require('./helper/build-info');
// optionally require env vars
try { require('./env') } catch (e) {}

const outDir = 'dist/unpacked-dev';
const mirrorDir = 'dist/unpacked-mirror';
const dev = true;
const watch = true;
const copyOptions = {outDir, mirrorDir, dev, watch};

clean.run(outDir);
clean.run(mirrorDir);
buildInfo.create({outDir, dev});
copy.core(copyOptions);
copy.specs(copyOptions);
copy.mirror(copyOptions);
webpack.watch({outDir});
