/**
 * Helpers for getting data from UI
 * `runContext.driver` must be set in before():
 *
 * test.before(function () {
 *   driver = runContext.driver = new Driver();
 *   ...
 * });
 */

const page = runContext.page;

runContext.runCode = function (code, path = 'undefined.js') {
  runContext.driver.executeScript(tests => {
    window.runTests(tests);
  }, [{path, code}]);
  runContext.driver.wait(until.titleContains('done'));
};

runContext.getConsoleText = function () {
  return runContext.driver.findElement(page.report.console).getText();
};

runContext.getConsoleLines = function () {
  return runContext.getConsoleText().then(runContext.textToLines);
};

runContext.textToLines = function (text) {
  text = text.trim();
  return text ? text.split('\n').map(line => line.trim()) : [];
};

