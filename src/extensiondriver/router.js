/**
 * Express-like router
 *
 * See: http://expressjs.com/en/4x/api.html#router.METHOD
 */

const path = require('path');
const RouteParser = require('route-parser');

module.exports = class Router {
  constructor(basePath = '/') {
    this._basePath = basePath;
    this._routes = [];
    this._middleware = [];
  }
  handle(req) {
    for (let route of this._routes) {
      if (req.method === route.method) {
        const matched = route.parser.match(req.path);
        if (matched) {
          this._applyMiddleware(req);
          const params = Object.assign({}, matched, req.body);
          return route.handler(params);
        }
      }
    }
    throw new Error(`Unsupported route command: ${req.method} ${req.path}`);
  }
  use(fn) {
    this._middleware.push(fn);
  }
  get(routePath, handler) {
    this.addRoute('get', routePath, handler);
  }
  post(routePath, handler) {
    this.addRoute('post', routePath, handler);
  }
  put(routePath, handler) {
    this.addRoute('put', routePath, handler);
  }
  del(routePath, handler) {
    this.addRoute('delete', routePath, handler);
  }
  addRoute(method, routePath, handler) {
    const fullPath = path.join(this._basePath, routePath);
    this._routes.push({
      method: method.toUpperCase(),
      handler,
      parser: new RouteParser(fullPath),
    });
  }
  _applyMiddleware(req) {
    this._middleware.forEach(fn => fn(req));
  }
};
