test.describe('examples', function () {
  var driver;

  test.before(function () {
    driver = new Driver();
    driver.get(runContext.selftest.ui);
    driver.wait(until.titleContains('ready'));
  });

  test.after(function () {
    driver.quit();
  });

  test.it('should run all without errors', function () {
    driver.findElement({id: 'run'}).click();
    driver.wait(until.titleContains('done'));
    assert(driver.findElement({id: 'console'}).getText()).equalTo('');
    assert(driver.findElement({css: '#mocha-stats .failures em'}).getText()).equalTo('0');
    assert(driver.findElement({css: '#mocha-stats .passes em'}).getText()).equalTo('2');
  });

});

