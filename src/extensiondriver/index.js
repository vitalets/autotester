/**
 * Extensions driver catches webdriver http commands and executes them via extension debugger API
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
  const router = new Router(basePath);
  router.use(bodyParser);
  routes.forEach(route => router.addRoute(route[0], route[1], route[2]));
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
  const errorObj = errors.encodeError(e);
  const data = {
    sessionId: Targets.SESSION_ID,
    value: {
      error: errorObj.error || e.name,
      message: errorObj.message || String(e),
      stackTrace: e.stack
    },
  };
  // if (e instanceof errors.WebDriverError) {
  //   const errorObj = errors.encodeError(e);
  //   data.status = errorObj.error;
  //   data.state = errorObj.message;
  // } else if (e instanceof Error) {
  //   data.status = e.name;
  //   data.state = e.message;
  // } else {
  //   data.status = 'error';
  //   data.message = String(e);
  // }
  return {
    statusCode: 500,
    data: JSON.stringify(data)
  };
}
