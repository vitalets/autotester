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
   * @param {Boolean} [filter.inverse = false]
   */
  constructor(filter) {
    this._filter = {};

    if (!filter) {
      return;
    }

    if (typeof filter === 'string' || filter instanceof RegExp ) {
      this._filter.url = filter;
    }

    if (typeof filter === 'object') {
      this._filter = filter;
    }
  }

  match(request) {
    const matches = [
      this._matchType,
      this._matchUrl,
      this._matchUrlStart,
      this._matchUrlParams
    ];
    const isMatched = matches.every(fn => {
      const res = fn.call(this, request);
      //console.log(fn.name, res, request.url);
      return res;
    });
    return this._filter.inverse ? !isMatched : isMatched;
  }

  toString() {
    return JSON.stringify(this._filter, (key, value) => {
      return value instanceof RegExp ? value.toString() : value;
    }, 2);
  }

  _hasField(field) {
    return this._filter[field] !== undefined;
  }

  _matchType(request) {
    return !this._hasField('type') || this._filter.type.toLowerCase() === request.type.toLowerCase();
  }

  _matchUrl(request) {
    return !this._hasField('url') || (this._filter.url instanceof RegExp
        ? this._filter.url.test(request.url)
        : this._filter.url === request.url);
  }

  _matchUrlStart(request) {
    return !this._hasField('urlStart') || request.url.startsWith(this._filter.urlStart);
  }

  _matchUrlParams(request) {
    if (!this._hasField('urlParams')) {
      return true;
    }
    const urlInstance = new URL(request.url);
    return Object.keys(this._filter.urlParams).every(name => {
      return urlInstance.searchParams.get(name) === this._filter.urlParams[name];
    });
  }
}
