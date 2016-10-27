/**
 * Store some predefined data in first run
 * To clear storage run from console: chrome.storage.local.clear()
 */

const thenChrome = require('then-chrome');
const mobx = require('mobx');
const fs = require('bro-fs');
const defaults = require('../state/defaults');
const defaultsExtra = require('../state/defaults-extra');
const {PROJECTS_DIR} = require('../state/constants');
const logger = require('../../utils/logger').create('Setup');

exports.applyOnFirstRun = function() {
  return isFirstRun()
    .then(firstRun => firstRun ? storeDefaults() : null);
};

/**
 * Resets local storage, filesystem and reloads ui
 */
exports.reset = function() {
  return Promise.all([
    fs.clear(),
    thenChrome.storage.local.clear(),
  ])
  .then(() => {
    // setTimeout is usefull here for test client to get response from evaluated script before page reload
    setTimeout(() => location.reload(), 50);
  });
};

/**
 * Detects first run by checking `installDate` key in storage
 */
function isFirstRun() {
  return thenChrome.storage.local.get('installDate')
    .then(data => Object.keys(data).length === 0);
}

function storeDefaults() {
  return Promise.all([
    storeToStorage(),
    storeToFs(),
  ]);
}

function storeToStorage() {
  const data = mobx.toJS({
    installDate: Date.now(),
    projects: [defaults.project],
    selectedProjectId: defaults.project.id,
    targets: defaults.targets.concat(defaultsExtra.targets),
    selectedTargetId: defaults.targets[0].id,
    hubs: defaults.hubs.concat(defaultsExtra.hubs),
    selectedTab: defaults.selectedTab,
  });
  logger.log(`Storing to storage`, data);
  return thenChrome.storage.local.set(data);
}

function storeToFs() {
  const path = `${PROJECTS_DIR}/${defaults.project.id}/${defaults.innerFile.path}`;
  const content = defaults.innerFile.code;
  logger.log(`Storing default inner file: ${path}`);
  return fs.writeFile(path, content);
}
