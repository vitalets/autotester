/**
 * API of window for programmatic run and other stuff
 */

const testsRun = require('./tests-run');
const htmlConsole = require('./html-console');
const setup = require('./setup');

/**
 * Exports API to window
 */
exports.init = function () {
  Object.assign(window, {
    /**
     * Run custom tests on loopback chrome
     *
     * @param {Array<{path, code}>} tests
     */
    runTests: testsRun.runCustomSnippets,
    /**
     * Console implementation to show test logs in report
     */
    htmlConsole: htmlConsole.getInstance(),

    resetDefaults: function () {
      return setup.reset();
    },

    // for custom reporting
    // todo: export module, not dom element
    report: document.getElementById('report')
  });
};
