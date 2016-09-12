/**
 * Extensions driver executes webdriver http commands using extension debugger API
 *
 * See: https://developer.chrome.com/extensions/debugger
 * See: https://chromedevtools.github.io/debugger-protocol-viewer/
 * See: https://w3c.github.io/webdriver/webdriver-spec.html#list-of-endpoints
 */

const Router = require('./router');
const routes = require('./routes');
const Targets = require('./targets');

let router;

/**
 * Main handler
 *
 * @param {Object} req
 * @returns {Promise} promise resolved with stringified response
 */
exports.handler = function (req) {
  const router = getRouter();
  return Promise.resolve()
    .then(() => router.handle(req))
    .then(result => formatResponse(result))
};

function getRouter() {
  if (!router) {
    router = new Router();
    router.use(bodyParser);
    routes.initRouter(router);
  }
  return router;
}

function bodyParser(req) {
  if (req.body && typeof req.body === 'string') {
    req.body = JSON.parse(req.body);
  }
}

function formatResponse(result) {
  const response = Object.assign({
    state: 'success',
    sessionId: Targets.SESSION_ID,
    // class: 'org.openqa.selenium.remote.Response',
    // hCode: 1590374043,
    value: result !== undefined ? result : null,
    status: 0
  }, result);
  return JSON.stringify(response);
}
