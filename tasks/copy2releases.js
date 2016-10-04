/**
 * Copies dist/autotester.zip to docs/releases/
 */

'use strict';

const fs = require('fs-extra');

const src = 'dist/autotester.zip';
const dest = 'docs/releases/autotester.zip';

fs.copySync(src, dest, {clobber: true});
console.log(`copy: ${src} --> ${dest}`);
