/**
 * API of uiWindow
 */

const title = require('./title');

/**
 * Exports API to window
 */
exports.setup = function () {
  Object.assign(window, {
    // for updating title during tests
    setRunningTestIndex,
    // for custom reporting
    report: document.getElementById('report')
  });
};

function setRunningTestIndex(testIndex) {
  const status = title.MSG_RUNNING_INDEX.replace('{i}', testIndex);
  title.set(status);
}
