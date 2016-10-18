test.describe('inner files', function () {
  var driver;

  test.before(function () {
    driver = runContext.driver = new Driver();
    driver.get(runContext.selftest.ui);
    driver.wait(until.titleContains('ready'));
    runContext.enableTestsSource('INNER');
  });

  test.after(function () {
    driver.quit();
  });

  test.it('should have 1 default inner file', function () {
    assert(driver.findElement({css: '#tests .dropdown__value'}).getText()).equalTo('All (1 file)');
    assert(driver.findElement({css: '#tests ul li:nth-child(2)'}).getText()).equalTo('google_search');
  });

  test.it('should run default inner file without errors', function () {
    driver.findElement({id: 'run'}).click();
    driver.wait(until.titleContains('done'));
    driver.findElements({css: '.report-tab .console'}).then(elems => assert(elems.length).equalTo(0));
    assert(driver.findElement({css: '#mocha-stats .failures em'}).getText()).equalTo('0');
    assert(driver.findElement({css: '#mocha-stats .passes em'}).getText()).equalTo('1');
  });

  test.it('should add new inner file', function () {
    runContext.selectTab(1);
    driver.findElement({css: '.tests-index button'}).click();
  });
});
