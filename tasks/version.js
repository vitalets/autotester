/**
 * Bump version to manifest.json
 */
'use strict';

const fs = require('fs-extra');
const {exec} = require('shelljs');

const version = require('../package').version;
const manifestPath = 'src/manifest.json';

const manifest = fs.readJsonSync(manifestPath);
manifest.version = version;
fs.writeJsonSync(manifestPath, manifest);
exec(`git add -A ${manifestPath}`);
console.log(`New version bumped to ${manifestPath}: ${version}`);
