test.describe('examples', function () {
  let driver;

  const page = runContext.page;

  test.before(function () {
    driver = runContext.driver = new Driver();
    driver.get(runContext.selftest.ui);
    driver.wait(until.titleContains('ready'), 2000);
    driver.findElement(page.tabHeaders.settings).click();
    driver.wait(until.elementLocated(page.settings.filesSource.url.label), 2000).click();
    // todo: wait title
    driver.sleep(1000);
  });

  test.after(function () {
    driver.quit();
  });

  test.it('should run all without errors', function () {
    driver.findElement(page.runButton).click();
    driver.wait(until.titleContains('done'));
    driver.findElements(page.report.console)
      .then(elems => assert(elems.length).equalTo(0));
    assert(driver.findElement(page.report.mochaStats.failures).getText()).equalTo('0');
    assert(driver.findElement(page.report.mochaStats.passes).getText()).equalTo('2');
  });

});

