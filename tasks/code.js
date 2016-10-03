'use strict';

const {exec} = require('shelljs');

exec('madge --format=cjs --circular src');
exec('check-dependencies');

//     "no-only-in-test": "if [ \"$(git diff --cached -- 'test/**/*.js'| grep '\\+' | grep '\\.only')\" != \"\" ]; then exit 1; fi",
