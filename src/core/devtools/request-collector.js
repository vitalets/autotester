/**
 * Collects requests from debugger and devtools catchers.
 * And makes assertion.
 */

class RequestCollector {
  constructor(extensionId) {
    this._requests = [];
    this._requestsAsString = '';
    this._devtoolsRequestCatcher = new DevtoolsRequestCatcher();
    if (extensionId) {
      this._extensionId = extensionId;
      BackgroundProxy.call(`debuggerRequestCatcher.setTarget`, {extensionId});
    }
  }

  start() {
    this._requestsAsString = '';
    this._requests = [];
    this._devtoolsRequestCatcher.start();
    return this._extensionId
      ? BackgroundProxy.call(`debuggerRequestCatcher.start`)
      : Promise.resolve();
  }

  stop() {
    this._requests = this._devtoolsRequestCatcher.stop();
    return this._extensionId
      ? BackgroundProxy.call(`debuggerRequestCatcher.stop`)
        .then(bgRequests => this._requests = this._requests.concat(bgRequests))
      : Promise.resolve();
  }

  filter(matchInfo) {
    return this._requests.filter(request => {
      if (matchInfo) {
        if (typeof matchInfo === 'string') {
          return matchInfo === request.url;
        }

        if (matchInfo instanceof RegExp) {
          return matchInfo.test(request.url);
        }

        if (typeof matchInfo === 'object') {
          return Object.keys(matchInfo).every(key => request[key] === matchInfo[key]);
        }
      }
      return true;
    });
  }

  assert(matchInfo, count = 1) {
    const filtered = this.filter(matchInfo);
    const msg = 'Requests not matched: ' + JSON.stringify(matchInfo, false, 2) + this.requestsAsString;
    assert.equal(filtered.length, count, msg);
  }

  get requests() {
    return this._requests.slice();
  }

  get requestsAsString() {
    if (!this._requestsAsString) {
      this._requestsAsString = `\nCatched requests: ${this._requests.length}\n`;
      this._requestsAsString += this._requests.map(r => `${r.method} ${r.url}`).join('\n') + '\n';
    }
    return this._requestsAsString;
  }
}
