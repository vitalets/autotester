test.describe('inner files', function () {
  let driver;

  const page = runContext.page;

  test.before(function () {
    driver = runContext.driver = new Driver();
    driver.get(runContext.selftest.ui);
    driver.wait(until.titleContains('ready'));
  });

  test.beforeEach(function () {
    driver.executeScript(() => window.resetDefaults());
    driver.sleep(200);
    driver.wait(until.titleContains('ready'));
    driver.wait(until.elementLocated(page.files.noSelection));
  });

  test.after(function () {
    driver.quit();
  });

  test.it('should have one default file', function () {
    assert(driver.findElement(page.filesDropdown.value).getText()).equalTo('All (1 file)');
    assert(driver.findElement(page.filesDropdown.item(1)).getText()).equalTo('All (1 file)');
    assert(driver.findElement(page.filesDropdown.item(2)).getText()).equalTo('google_search');
  });

  test.describe('default file', function () {

    test.beforeEach(function () {
      driver.findElement(page.filesDropdown).click();
      driver.sleep(400);
      driver.findElement(page.filesDropdown.item(2)).click();
      driver.wait(until.elementLocated(page.files.editor.filename));
    });

    test.it('should show name in dropdown', function () {
      assert(driver.findElement(page.filesDropdown.value).getText()).equalTo('google_search');
    });

    test.it('should run without errors', function () {
      driver.findElement({id: 'run'}).click();
      driver.wait(until.titleContains('done'));
      // need sleep as mocha report seems to get updated with little delay
      driver.sleep(100);
      driver.findElements(page.report.console).then(elems => assert(elems.length).equalTo(0));
      assert(driver.findElement(page.report.mochaStats.failures).getText()).equalTo('0');
      assert(driver.findElement(page.report.mochaStats.passes).getText()).equalTo('1');
    });

    test.it('should be renamed', function () {
      driver.findElement(page.files.editor.filename).sendKeys('123');
      // there is debounce 500ms
      driver.sleep(600);
      assert(driver.findElement(page.filesDropdown.value).getText()).equalTo('google_search123');
      assert(driver.findElement(page.filesDropdown.item(2)).getText()).equalTo('google_search123');
    });

    test.it('should be deleted', function () {
      driver.findElement(page.files.editor.buttons.delete).click();
      // todo: use driver.wait(until.alertIsPresent)
      driver.sleep(200);
      driver.switchTo().alert().accept();
      driver.findElements(page.filesDropdown.items).then(elems => assert(elems.length).equalTo(0));
    });

  });

  test.describe('newly created file', function () {

    test.beforeEach(function () {
      driver.findElement(page.files.noSelection.button).click();
      driver.wait(until.elementLocated(page.files.editor.filename));
    });

    test.it('should have correct name and template', function () {
      assert(driver.findElement(page.files.editor.filename).getAttribute('value')).equalTo('new_file_1');
      assert(driver.findElement(page.filesDropdown.item(1)).getText()).equalTo('All (2 files)');
      assert(driver.findElement(page.filesDropdown.item(2)).getText()).equalTo('google_search');
      assert(driver.findElement(page.filesDropdown.item(3)).getText()).equalTo('new_file_1');
      driver.findElement(page.files.editor.code).getText()
        .then(text => {
          assert(text.replace(/[\n\s]/g, '')).equalTo(NEW_FILE_TPL.replace(/[\n\s]/g, ''));
        });
    });

    test.it('should run without errors', function () {
      driver.findElement(page.runButton).click();
      driver.wait(until.titleContains('done'));
      // need sleep as mocha report seems to get updated with little delay
      driver.sleep(100);
      driver.findElements(page.report.console).then(elems => assert(elems.length).equalTo(0));
      assert(driver.findElement(page.report.mochaStats.failures).getText()).equalTo('0');
      assert(driver.findElement(page.report.mochaStats.passes).getText()).equalTo('1');
    });

    test.it('should be deleted', function () {
      driver.findElement(page.files.editor.buttons.delete).click();
      // todo: use driver.wait(until.alertIsPresent)
      driver.sleep(200);
      driver.switchTo().alert().accept();
      assert(driver.findElement(page.filesDropdown.item(1)).getText()).equalTo('All (1 file)');
      assert(driver.findElement(page.filesDropdown.item(2)).getText()).equalTo('google_search');
    });

  });

});

const NEW_FILE_TPL = `
test.describe('new_file_1', function () {
  let driver;

 test.before(function () {
    driver = new Driver();
  });

  test.after(function () {
    driver.quit();
  });

  test.it('should pass', function () {
    driver.get('https://google.com');
    driver.wait(until.titleContains('Google'), 2000);
  });
});`;
