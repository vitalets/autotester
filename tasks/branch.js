'use strict';

const status = require('./helper/status');

const RELEASE_BRANCH = 'master';

const actualBranch = status.getBranch();
if (actualBranch !== RELEASE_BRANCH) {
  console.log(`Invalid branch: ${actualBranch}, expected: ${RELEASE_BRANCH}`);
  process.exit(1);
}

const changes = status.getChanges();
if (changes) {
  console.log('Dirty state:', changes);
  process.exit(1);
}
