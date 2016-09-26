/**
 * Store some predefined data in first run
 * To clear storage run from console: chrome.storage.local.clear()
 */

const thenChrome = require('then-chrome');
const predefinedData = require('../store/data');
const logger = require('../../utils/logger').create('Setup');

exports.applyOnFirstRun = function() {
  return isFirstRun()
    .then(firstRun => firstRun ? storePreDefinedData() : null);
};

/**
 * Detects first run by checking `hub` key in storage
 */
function isFirstRun() {
  return thenChrome.storage.local.get('hubs')
    .then(data => Object.keys(data).length === 0);
}

function storePreDefinedData() {
  const data = {
    hubs: predefinedData.hubs,
    targets: predefinedData.targets,
    snippets: predefinedData.snippets,
  };
  logger.log('Storing pre-defined data', data);
  return thenChrome.storage.local.set(data);
}


