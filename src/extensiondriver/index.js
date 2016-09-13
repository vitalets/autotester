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

/**
 * Main handler
 *
 * @param {Object} serverUrl supposed for requests (actually we take only pathname from it)
 */
exports.getHandler = function (serverUrl) {
  const basePath = serverUrl ? new URL(serverUrl).pathname : '/';
  const router = getRouter(basePath);
  return function (req) {
    return Promise.resolve()
      .then(() => router.handle(req))
      .then(result => formatResponse(result))
  };
};

function getRouter(basePath) {
  router = new Router(basePath);
  router.use(bodyParser);
  routes.initRouter(router);
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
