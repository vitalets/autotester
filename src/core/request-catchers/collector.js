/**
 * Collects requests from several catchers
 */

class RequestCollector {
  /**
   * Configure catchers
   * @param {Array} catchers
   */
  constructor(catchers = []) {
    this._catchers = catchers;
  }

  start() {
    this._requestsAsString = '';
    this._requests = [];
    // exclude 'data:' urls
    const filter = {urlStart: 'data:', inverse: true};
    const tasks = this._catchers.map(catcher => catcher.start(filter));
    return Promise.all(tasks);
  }

  stop() {
    const tasks = this._catchers.map(catcher => catcher.stop());
    return Promise.all(tasks).then(requests => {
      // flatten requests array
      this._requests = requests.reduce((res, reqs) => res.concat(reqs), []);
      return this._requests;
    });
  }

  getRequests(filter) {
    const requestFilter = new RequestFilter(filter);
    return this._requests.filter(request => requestFilter.match(request));
  }

  getRequestsAsString() {
    if (!this._requestsAsString) {
      this._requestsAsString = `Catched requests: ${this._requests.length}\n`;
      this._requestsAsString += this._requests.map(r => `${r.method} ${r.url}`).join('\n') + '\n';
    }
    return this._requestsAsString;
  }
}
