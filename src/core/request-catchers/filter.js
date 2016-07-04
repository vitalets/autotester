/**
 * Easy filter requests by different params
 */

class RequestFilter {
  /**
   * Constructor
   * @param {String|RegExp|Object} [filter]
   * @param {String|RegExp} [filter.url]
   * @param {String} [filter.urlStart]
   * @param {String} [filter.type]
   * @param {Object} [filter.urlParams]
   * @param {Boolean} [filter.includeDataUrls = false]
   */
  constructor(filter) {
    this.filter = {};

    if (!filter) {
      return;
    }

    if (typeof filter === 'string' || filter instanceof RegExp ) {
      this.filter.url = filter;
    }

    if (typeof filter === 'object') {
      this.filter = filter;
    }
  }

  match(request) {
    let urlInstance = null;
    return Object.keys(this.filter).every(field => {
      if (field === 'url') {
        return this._matchUrl(request.url);
      }
      if (field === 'urlStart') {
        return request.url.startsWith(this.filter.urlStart);
      }
      if (field === 'urlParams') {
        urlInstance = urlInstance || new URL(request.url);
        console.log( this._matchUrlParams(urlInstance), request.url);
        return this._matchUrlParams(urlInstance);
      }
      // exact match
      return this.filter[field] === request[field];
    });
  }

  toString() {
    return JSON.stringify(this.filter, (key, value) => {
      return value instanceof RegExp ? value.toString() : value;
    }, 2);
  }

  _matchUrl(requestUrl) {
    return this.filter.url instanceof RegExp
      ? this.filter.url.test(requestUrl)
      : this.filter.url === requestUrl;
  }

  _matchUrlParams(urlInstance) {
    return Object.keys(this.filter.urlParams).every(name => {
      // console.log(urlInstance.href);
      console.log(name, urlInstance.searchParams.get(name), this.filter.urlParams[name]);
      return urlInstance.searchParams.get(name) === this.filter.urlParams[name];
    });
  }
}
