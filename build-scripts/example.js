/**
 * Build unpacked extension with specified example
 */

"use strict";

const fs = require('fs-extra');

const exampleDir = process.argv[2];

const outPath = `dist/unpacked`;
const srcPath = `src`;
const examplePath = `examples/${exampleDir}`;

if (!fs.existsSync(examplePath)) {
  console.error(`Example dir not found: ${examplePath}`);
  process.exit(1);
}

fs.emptyDirSync(outPath);
fs.copySync(srcPath, outPath);
fs.removeSync(`${outPath}/tests`);
fs.copySync(examplePath, `${outPath}/tests`);

console.log(`Created ${outPath}`);
