/**
 * Loads tests config file (index.js)
 */

const utils = require('../driver/utils');

class ConfigLoader {
  constructor (baseUrl) {
    this._baseUrl = baseUrl.replace(/\/$/, '') + '/';
  }

  load () {
    const url = `${this._baseUrl}index.js`;
    console.log(`Loading tests config: ${url}`);
    return utils.fetchCommonJsScript(url)
      .then(config => this._postProcess(config));
  }

  _postProcess (config) {
    config.prepare = this._addBaseUrl(config.prepare);
    config.tests = this._addBaseUrl(config.tests);
    return config;
  }

  _addBaseUrl (arr) {
    return Array.isArray(arr)
      ? arr.map(path => this._baseUrl + path.replace(/^\//, ''))
      : arr;
  }
}

module.exports = ConfigLoader;
