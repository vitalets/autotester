/**
 * Collect network requests from current tab and urls of new opened tabs.
 */

const Filter = require('./filter');
const RequestCatcher = require('./request-catcher');
const NewTabCatcher = require('./newtab-catcher');
const logger = require('../../../utils/logger').create('Requests collector');

const DEFAULT_REQUESTS_LIMIT = 1000;

module.exports = class Collector {

  constructor() {
    this._requests = [];
    this._collecting = false;
    this._requestCatcher = new RequestCatcher();
    this._newTabCatcher = new NewTabCatcher();
    this._setOnCatchedListeners();
  }

  start() {
    if (this._collecting) {
      throw new Error('Collector already in collecting state');
    }
    this._requests.length = 0;
    return Promise.resolve()
      .then(() => this._requestCatcher.start())
      .then(() => this._newTabCatcher.start())
      .then(() => {
        this._collecting = true;
        logger.log('start collecting');
      })
  }

  stop() {
    if (!this._collecting) {
      return Promise.resolve();
    }
    return Promise.resolve()
      .then(() => this._newTabCatcher.stop())
      .then(() => this._requestCatcher.stop())
      .then(() => {
        this._collecting = false;
        logger.log('stop collecting');
      })
  }

  /**
   * Returns catched requests passing filter
   *
   * @param {Object} filter
   */
  get(filter) {
    const requestFilter = new Filter(filter);
    return this._requests.filter(request => requestFilter.match(request));
  }

  _setOnCatchedListeners() {
    this._requestCatcher.onCatched.addListener(this._onRequestCatched, this);
    this._newTabCatcher.onCatched.addListener(this._onNewTabCatched, this);
  }

  _onRequestCatched(data) {
    if (this._collecting) {
      const request = {
        type: data.type,
        method: data.request.method,
        url: data.request.url,
      };
      this._addRequest(request);
    }
  }

  _onNewTabCatched(data) {
    if (this._collecting) {
      const request = {
        type: 'Newtab',
        method: 'GET',
        url: data.url,
      };
      this._addRequest(request);
    }
  }

  _addRequest(request) {
    if (this._requests.length >= DEFAULT_REQUESTS_LIMIT) {
      this._requests.shift();
    }
    this._requests.push(request);
  }

};
