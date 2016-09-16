/**
 * Setup loopback
 */

const fakeHttp = require('../utils/fake-http');
const extensionDriver = require('../extensiondriver');

let doneForServerUrl = '';

exports.setup = function (serverUrl) {
  if (!doneForServerUrl || doneForServerUrl !== serverUrl) {
    const handler = extensionDriver.getHandler(serverUrl);
    fakeHttp.setHandler(handler);
    doneForServerUrl = serverUrl;
  }
};
