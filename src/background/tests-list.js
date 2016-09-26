/**
 * Loads and parse tests list
 */

const utils = require('../utils');
const evaluate = require('../utils/evaluate');
const logger = require('../utils/logger').create('Tests-list');

exports.load = function (url) {
  logger.log(`Loading from: ${url}`);
  return utils.fetchText(url)
    .then(text => parseConfig(text, url));
};

function parseConfig(text, url) {
  const config = evaluate.asCommonJs(url, text);
  validateConfig(config);
  config.url = url;
  logger.log('Loaded and validated:', config);
  return config;
}

function validateConfig(config) {
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
