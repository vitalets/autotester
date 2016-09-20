/**
 * Runs tests
 */

const Run = require('../run');

exports.run = function () {

};

/**
 * Run tests
 *
 * @param {Object} data
 * @param {String} data.selectedTest
 * @param {String} data.targetId
 * @param {String} [data.noQuit]
 * @param {Array<{code, path}>} [data.files] special case to run custom files from ui window.runTests
 */
function runTests(data) {
  // todo: refactor
  try {
    // const target = targets.get(data.targetId);

    const run = new Run({
      uiWindow: getUiWindow(),
      noQuit: data.noQuit,
      engine: 'selenium',
      // target: target,
    });

    let runnerPromise;
    if (data.files) {
      runnerPromise = run.runSnippets(data.files);
    } else {
      const tests = this._testsConfig.tests.filter(test => !data.selectedTest || test === data.selectedTest);
      const setup = this._testsConfig.setup;
      const files = setup.concat(tests);
      runnerPromise = run.runRemoteFiles(files, storage.get('baseUrl'));
    }
    runnerPromise
      .then(() => {
        messaging.send(RUN_TESTS_DONE)
      })
      .catch(e => {
        messaging.send(RUN_TESTS_DONE);
        throw e;
      });
  } catch (e) {
    messaging.send(RUN_TESTS_DONE);
    throw e;
  }
}

function getUiWindow() {
  const views = chrome.extension.getViews({type: 'tab'});
  if (views.length) {
    return views[0];
  } else {
    throw new Error('Autotester tab not found!');
  }
}
