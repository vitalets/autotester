/**
 * Collects requests from several catchers
 */

class RequestCollector {
  /**
   * Configure catchers
   * @param {Array} catchers
   */
  constructor(catchers = []) {
    this._catchers = catchers.filter(Boolean);
  }

  start() {
    this._requestsAsString = '';
    this._requests = [];
    const tasks = this._catchers.map(catcher => catcher.start());
    return Promise.all(tasks);
  }

  stop() {
    const tasks = this._catchers.map(catcher => catcher.stop());
    return Promise.all(tasks).then(requests => {
      // flatten requests array
      this._requests = requests.reduce((res, reqs) => res.concat(reqs), []);
    });
  }

  getRequests(filter) {
    return this._requests.filter(request => {
      if (filter) {
        if (typeof filter === 'string') {
          return filter === request.url;
        }

        if (filter instanceof RegExp) {
          return filter.test(request.url);
        }

        if (typeof filter === 'object') {
          return Object.keys(matchInfo).every(key => request[key] === filter[key]);
        }
      }
      return true;
    });
  }

  getRequestsAsString() {
    if (!this._requestsAsString) {
      this._requestsAsString = `Catched requests: ${this._requests.length}\n`;
      this._requestsAsString += this._requests.map(r => `${r.method} ${r.url}`).join('\n') + '\n';
    }
    return this._requestsAsString;
  }
}
