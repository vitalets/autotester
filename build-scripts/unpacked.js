/**
 * Creates unpacked extension in `dist/unpacked` with optional example tests
 */

"use strict";

const fs = require('fs-extra');

exports.create = function (exampleDir) {
  const outPath = `dist/unpacked`;
  const srcPath = `src`;
  const examplePath = `examples/${exampleDir}`;
  const testsPath = `${outPath}/tests`;

  fs.emptyDirSync(outPath);
  fs.copySync(srcPath, outPath);
  fs.removeSync(testsPath);

  if (fs.existsSync(examplePath)) {
    fs.copySync(examplePath, testsPath);
    console.log(`Created: ${outPath} with '${exampleDir}' tests`);
  } else {
    fs.mkdirsSync(testsPath);
    console.log(`Created: ${outPath} with no tests`);
  }
};
