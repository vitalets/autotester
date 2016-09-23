/**
 * Runs tests
 */

const Run = require('../run');
const {onTestsDone, onSessionStarted} = require('./internal-channels');

/**
 * Run tests
 *
 * @param {Object} data
 * @param {Object} data.target where to run tests
 * @param {String} [data.baseUrl] base url for files
 * @param {Array<String>} [data.files] files relative to baseUrl to be downloaded and runned
 * @param {Array<{path, code}>} [data.snippets] snippets
 * @param {String} [data.noQuit]
 */
exports.run = function (data) {
  try {
    const run = new Run({
      uiWindow: getUiWindow(),
      noQuit: data.noQuit,
      engine: 'selenium',
      target: data.target,
    });

    run.onSessionStarted.addListener(res => {
      onSessionStarted.dispatch({
        sessionId: res.sessionId,
        target: data.target,
      });
    });

    const runningPromise = data.snippets
      ? run.runSnippets(data.snippets)
      : run.runRemoteFiles(data.files, data.baseUrl);

    return runningPromise
      .then(done, fail);
  } catch (e) {
    fail(e);
  }
};

/**
 * Returns first autotester ui window
 */
function getUiWindow() {
  const views = chrome.extension.getViews({type: 'tab'});
  if (views.length) {
    return views[0];
  } else {
    throw new Error('Autotester tab not found!');
  }
}

function done() {
  onTestsDone.dispatch();
}

function fail(e) {
  onTestsDone.dispatch();
  throw e;
}
