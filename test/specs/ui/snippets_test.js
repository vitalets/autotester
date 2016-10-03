test.describe('snippets', function () {
  var driver;

  test.before(function () {
    driver = runContext.driver = new Driver();
    driver.get(runContext.selftest.ui);
    driver.wait(until.titleContains('ready'));
    runContext.enableTestsSource('SNIPPETS');
  });

  test.after(function () {
    driver.quit();
  });

  test.it('should run all without errors', function () {
    driver.findElement({id: 'run'}).click();
    driver.wait(until.titleContains('done'));
    driver.findElements({css: '.report-tab .console'}).then(elems => assert(elems.length).equalTo(0));
    assert(driver.findElement({css: '#mocha-stats .failures em'}).getText()).equalTo('0');
    assert(driver.findElement({css: '#mocha-stats .passes em'}).getText()).equalTo('1');
  });

});
