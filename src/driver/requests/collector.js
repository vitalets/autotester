/**
 * Collect network requests from current tab and urls of new opened tabs.
 */

const Filter = require('./filter');
const RequestCatcher = require('./request-catcher');
const NewTabCatcher = require('./newtab-catcher');
const logger = require('../../utils/logger').create('Requests collecctor');

const DEFAULT_REQUESTS_LIMIT = 1000;

class Collector {

  constructor() {
    this._requests = [];
    this._collecting = false;
    this._requestCatcher = new RequestCatcher();
    this._newTabCatcher = new NewTabCatcher();
    this._setOnCatchedListeners();
    this.reset();
  }

  get collecting() {
    return this._collecting;
  }

  collect() {
    if (this._collecting) {
      throw new Error('Requests already in collecting state');
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
    const filtered = this._requests.filter(request => requestFilter.match(request));
    return Promise.resolve(filtered);
  }

  getCount(filter) {
    return this.get(filter).then(requests => requests.length);
  }

  dump(logging) {
    const result = this._requests.map(r => `${r.type}: ${r.method} ${r.url}`);
    result.unshift(`Collected ${this._requests.length} request(s):`);
    const resultStr = result.join('\n');
    if (logging) {
      logging.log(resultStr);
    }
    return Promise.resolve(resultStr);
  }

  limit(count) {
    this._limit = count;
  }

  reset() {
    this._limit = DEFAULT_REQUESTS_LIMIT;
    return this._collecting ? this.stop() : Promise.resolve();
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
    if (this._limit && this._requests.length >= this._limit) {
      this._requests.shift();
    }
    this._requests.push(request);
  }

}

module.exports = Collector;
