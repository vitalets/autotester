/**
 * Helpers for getting data from UI
 * `runContext.driver` must be set in before():
 *
 * test.before(function () {
 *   driver = runContext.driver = new Driver();
 *   ...
 * });
 */

runContext.runCode = function (code, path = 'test.js') {
  runContext.driver.executeScript(tests => {
    runTests(tests);
  }, [{path, code}]);
  runContext.driver.wait(until.titleContains('done'));
};

runContext.getConsoleText = function () {
  return runContext.driver.findElement({css: '.report-tab .console'}).getText();
};

runContext.getConsoleLines = function () {
  return runContext.getConsoleText().then(runContext.textToLines);
};

runContext.textToLines = function (text) {
  text = text.trim();
  return text ? text.split('\n').map(line => line.trim()) : [];
};

runContext.enableTestsSourceBuiltIn = function () {
  // enable tests source=built-in from settings
  const driver = runContext.driver;
  driver.findElement({css: '.mdl-tabs__tab:nth-child(3)'}).click();
  driver.findElement({css: '.settings-tests-source input[value="BUILT_IN"]'}).click();
  driver.sleep(600);
};

runContext.enableTestsSourceSnippets = function () {
  // enable tests source=built-in from settings
  const driver = runContext.driver;
  driver.findElement({css: '.mdl-tabs__tab:nth-child(3)'}).click();
  driver.findElement({css: '.settings-tests-source input[value="SNIPPETS"]'}).click();
  driver.sleep(600);
};
