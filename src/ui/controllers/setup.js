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
 * Detects first run by checking `hub` key in storage
 */
function isFirstRun() {
  return thenChrome.storage.local.get('hubs')
    .then(data => Object.keys(data).length === 0);
}

function storeDefaults() {
  return Promise.all([
    storeExtraField('hubs'),
    storeExtraField('targets'),
    storeInnerFile(),
  ]);
}

function storeExtraField(field) {
  if (defaultsExtra[field].length) {
    const data = mobx.toJS({
      [field]: defaults[field].concat(defaultsExtra[field])
    });
    logger.log(`Storing extra defaults ${field}`, data);
    return thenChrome.storage.local.set(data);
  }
}

function storeInnerFile() {
  const path = `projects/${defaults.projectId}/${defaults.innerFile.path}`;
  const content = defaults.innerFile.code;
  logger.log(`Storing default inner file: ${path}`);
  return localFs.save(path, content);
}
