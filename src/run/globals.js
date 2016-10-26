/**
 * Base globals available in tests.
 * Can be extended by engine specific globals
 */

const Channel = require('chnl');
const fakeRequire = require('./fake-require');

/**
 * Set globals to context
 *
 * @param {Object} context
 * @param {Object} uiWindow
 */
exports.setGlobals = function (context, uiWindow) {
  Object.assign(context, {
    runContext: {},
    // for running tests written for node
    require: fakeRequire.getFn(),
    // for debug
    uiConsole: uiWindow.htmlConsole,
    // for custom reporting
    report: uiWindow.report,
    // this channel is used in test-file wrapper for catching errors
    __onTestFileError: new Channel()
  });
};

/**
 * Clear keys before each session
 * Especially global `require` breaks loading mocha
 *
 * @param {Window} context
 */
exports.clear = function (context) {
  delete context.runContext;
  delete context.require;
  delete context.uiConsole;
  delete context.__onTestFileError;
};
