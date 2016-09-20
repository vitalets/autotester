/**
 * Loads and parse tests list
 */

const utils = require('../utils');
const evaluate = require('../utils/evaluate');

exports.load = function () {
  const url = addBaseUrl('index.js');
  return utils.fetchText(url)
    .then(
      text => parseConfig(text, url),
      err => messaging.send(LOAD_TESTS_CONFIG_DONE, {error: `Config not found: **${url}**`})
    );
};

function parseConfig(text, url) {
  const config = evaluate.asCommonJs(url, text);
  this._verifyConfig(config);
  config.url = url;
  this._testsConfig = config;
  //this._updateSelectedTest();
  messaging.send(LOAD_TESTS_CONFIG_DONE, {
    config: config,
    //selectedTest: storage.get('selectedTest'),
  });
}

function addBaseUrl(path) {
  const baseUrl = utils.trimSlashes(storage.get('baseUrl'));
  path = utils.trimSlashes(path);
  return `${baseUrl}/${path}`;
}

function verifyConfig(config) {
  if (!config) {
    throw new Error('Config is empty');
  }
  if (!Array.isArray(config.setup)) {
    config.setup = [];
  }
  if (!Array.isArray(config.tests)) {
    config.tests = [];
  }
}
