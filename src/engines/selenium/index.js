/**
 * Setup env for running webdriver command via selenium engine
 */

const os = require('os');

/**
 * Add needed globals to context
 *
 * @param {Object} context
 */
exports.setGlobals = function (context) {
  cleanUp();
  supportNode();
  setVars(context);
  setupFakeRequire(context);
};

/**
 * Set remote selenium server url
 */
exports.setServerUrl = function (serverUrl) {
  process.env.SELENIUM_REMOTE_URL = serverUrl;
};

/**
 * Set capabilities
 */
exports.setCapabilities = function (caps = {}) {
  process.env.SELENIUM_BROWSER = caps.browserName || 'chrome';
};

function setVars(context) {
  const webdriver = require('selenium-webdriver');
  Object.assign(context, {
    webdriver: webdriver,
    By: webdriver.By,
    Key: webdriver.Key,
    until: webdriver.until,
    test: require('selenium-webdriver/testing'),
    assert: require('selenium-webdriver/testing/assert'),
  });
}

function setupFakeRequire(context) {
  context.require.register('selenium-webdriver', require('selenium-webdriver'));
  context.require.register('selenium-webdriver/testing', require('selenium-webdriver/testing'));
  context.require.register('selenium-webdriver/testing/assert', require('selenium-webdriver/testing/assert'));
  context.require.register('selenium-webdriver/lib/promise', require('selenium-webdriver/lib/promise'));
  context.require.register('assert', require('assert'));
}

function cleanUp() {
  // remove selenium-webdriver/testing from cache as it wraps mocha globals on start and keep cached
  delete require.cache[require.resolve('selenium-webdriver/testing')];
}

/**
 * Some nodejs shims to load selenium-webdriver in browser context
 */
function supportNode() {
  // needed for selenium-webdriver/safari
  process.env.USER = 'USER';
  process.env.APPDATA = 'APPDATA';
  // needed for selenium-webdriver/net/index.js
  process.platform = 'darwin';
  os.networkInterfaces = os.getNetworkInterfaces = function () {
    return {
      lo0: [{
        family: 'IPv4',
        internal: true,
        address: 'localhost',
      }]
    };
  };
}
