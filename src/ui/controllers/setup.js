/**
 * Store some predefined data in first run
 * To clear storage run from console: chrome.storage.local.clear()
 */

const thenChrome = require('then-chrome');
const predefinedData = require('../store/data');
const localFs = require('../../utils/local-fs');
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
  return Promise.all([
    storeInStorage(),
    storeInFs(),
  ]);
}

function storeInStorage() {
  const data = {
    hubs: predefinedData.hubs,
    targets: predefinedData.targets,
    projects: predefinedData.projects,
    selectedProjectId: predefinedData.projects[0].id,
  };
  logger.log('Storing pre-defined data in storage', data);
  return thenChrome.storage.local.set(data);
}

function storeInFs() {
  const project = predefinedData.projects[0];
  const snippet = project.snippets[0];
  const path = `projects/${project.id}/${snippet.filename}`;
  const content = predefinedData.snippetsCode[snippet.filename];
  logger.log(`Storing pre-defined snippet: ${path}`);
  return localFs.save(path, content);
}
