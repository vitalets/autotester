/**
 * Store some predefined data in first run
 * To clear storage run from console: chrome.storage.local.clear()
 */

const thenChrome = require('then-chrome');
const mobx = require('mobx');
const defaults = require('../state/defaults');
const defaultsExtra = require('../state/defaults-extra');
const localFs = require('../../utils/local-fs');
const logger = require('../../utils/logger').create('Setup');

exports.applyOnFirstRun = function() {
  return isFirstRun()
    .then(firstRun => firstRun ? storeDefaults() : null);
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
    saveInnerFile(),
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
  });
  logger.log(`Storing to storage`, data);
  return thenChrome.storage.local.set(data);
}

function saveInnerFile() {
  const path = `projects/${defaults.project.id}/${defaults.innerFile.path}`;
  const content = defaults.innerFile.code;
  logger.log(`Storing default inner file: ${path}`);
  return localFs.save(path, content);
}
