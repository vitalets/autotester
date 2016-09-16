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
const errors = require('./errors');

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
      .then(
        formatSuccess,
        formatError
      );
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

function formatSuccess(result) {
  const data = {
    sessionId: Targets.SESSION_ID,
    value: result !== undefined ? result : null,
  };
  return {
    statusCode: 200,
    data: JSON.stringify(data),
  };
}

function formatError(e) {
  return e instanceof errors.WebDriverError
    ? formatWebDriverError(e)
    : Promise.reject(e);
}

function formatWebDriverError(e) {
  const errorObj = errors.encodeError(e);
  const data = {
    error: errorObj.error,
    message: errorObj.message,
    stacktrace: e.stack,
    sessionId: Targets.SESSION_ID,
  };
  return {
    statusCode: 500,
    data: JSON.stringify(data)
  };
}
