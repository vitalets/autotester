/**
 * API of window for programmatic run and other stuff
 */

/**
 * Exports API to window
 */
exports.init = function () {
  Object.assign(window, {
    // todo:
    runTests: () => {},

    // for custom reporting
    report: document.getElementById('report')
  });
};
