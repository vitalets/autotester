/**
 * Packs 2 crx for self testing
 */
'use strict';

const crx = require('./helper/crx');

crx.pack('dist/unpacked-dev', 'tasks/keys/autotester-dev.pem', 'dist/autotester-dev.crx');
crx.pack('dist/unpacked-mirror', 'tasks/keys/autotester.pem', 'dist/autotester.crx');
