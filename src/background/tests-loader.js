/**
 * Reads tests config file (index.js)
 */

const utils = require('../driver/utils');

class TestsLoader {
  constructor (baseUrl) {
    this._baseUrl = baseUrl.replace(/\/$/, '') + '/';
    this._config = null;
  }

  loadConfig () {
    const url = `${this._baseUrl}index.js`;
    console.log(`Loading tests config: ${url}`);
    return utils.fetchCommonJsScript(url)
      .then(config => this._setConfig(config));
  }

  get config() {
    return this._config;
  }

  _setConfig (config) {
    this._config = config;
    this._config.prepare = this._addBaseUrl(this._config.prepare);
    this._config.tests = this._addBaseUrl(this._config.tests);
    return this._config;
  }

  _addBaseUrl (arr) {
    return Array.isArray(arr)
      ? arr.map(path => this._baseUrl + path.replace(/^\//, ''))
      : arr;
  }
}

module.exports = TestsLoader;
