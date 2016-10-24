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
    assert(driver.findElement({css: '#tests ul li:nth-child(1)'}).getText()).equalTo('All (1 file)');
    assert(driver.findElement({css: '#tests ul li:nth-child(2)'}).getText()).equalTo('google_search');
  });

  test.it('should run default inner file without errors', function () {
    driver.findElement({id: 'run'}).click();
    driver.wait(until.titleContains('done'));
    driver.findElements({css: '.report-tab .console'}).then(elems => assert(elems.length).equalTo(0));
    assert(driver.findElement({css: '#mocha-stats .failures em'}).getText()).equalTo('0');
    assert(driver.findElement({css: '#mocha-stats .passes em'}).getText()).equalTo('1');
  });

  // wait reset feature to be able to remove all created files
  test.it.skip('should add new inner file from index button', function () {
    runContext.selectTab(1);
    driver.findElement({css: '#tests'}).click();
    driver.sleep(300);
    driver.findElement({css: '#tests .mdl-menu__item:first-child'}).click();
    driver.findElement({css: '.no-file-selected button'}).click();
  });
});
