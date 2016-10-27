test.describe('inner files', function () {
  var driver;

  test.before(function () {
    driver = runContext.driver = new Driver();
    driver.get(runContext.selftest.ui);
    driver.wait(until.titleContains('ready'));
  });

  test.beforeEach(function () {
    driver.executeScript(() => window.resetDefaults());
    driver.sleep(200);
    driver.wait(until.titleContains('ready'));
    driver.wait(until.elementLocated({css: '.no-file-selected'}));
  });

  test.after(function () {
    driver.quit();
  });

  test.it('should have one default file', function () {
    assert(driver.findElement({css: '#tests .dropdown__value'}).getText()).equalTo('All (1 file)');
    assert(driver.findElement({css: '#tests ul li:nth-child(1)'}).getText()).equalTo('All (1 file)');
    assert(driver.findElement({css: '#tests ul li:nth-child(2)'}).getText()).equalTo('google_search');
  });

  test.describe('default file', function () {

    test.beforeEach(function () {
      driver.findElement({css: '#tests'}).click();
      driver.sleep(200);
      driver.findElement({css: '#tests ul li:nth-child(2)'}).click();
      driver.wait(until.elementLocated({css: '#textfield-Filename'}));
    });

    test.it('should show name in dropdown', function () {
      assert(driver.findElement({css: '#tests .dropdown__value'}).getText()).equalTo('google_search');
    });

    test.it('should run without errors', function () {
      driver.findElement({id: 'run'}).click();
      driver.wait(until.titleContains('done'));
      driver.findElements({css: '.report-tab .console'}).then(elems => assert(elems.length).equalTo(0));
      assert(driver.findElement({css: '#mocha-stats .failures em'}).getText()).equalTo('0');
      assert(driver.findElement({css: '#mocha-stats .passes em'}).getText()).equalTo('1');
    });

    test.it('should be renamed', function () {
      driver.findElement({css: '#textfield-Filename'}).sendKeys('123');
      // there is debounce 500ms
      driver.sleep(600);
      assert(driver.findElement({css: '#tests .dropdown__value'}).getText()).equalTo('google_search123');
      assert(driver.findElement({css: '#tests ul li:nth-child(2)'}).getText()).equalTo('google_search123');
    });

    test.it('should be deleted', function () {
      driver.findElement({css: '#editor [data-test-id="delete"]'}).click();
      // todo: use driver.wait(until.alertIsPresent)
      driver.sleep(200);
      driver.switchTo().alert().accept();
      driver.findElements({css: '#tests ul li'}).then(elems => assert(elems.length).equalTo(0));
    });

  });

  test.describe('newly created file', function () {

    test.beforeEach(function () {
      driver.findElement({css: '.no-file-selected button'}).click();
      driver.wait(until.elementLocated({css: '#textfield-Filename'}));
    });

    test.it('should have correct name and template', function () {
      assert(driver.findElement({css: '#textfield-Filename'}).getAttribute('value')).equalTo('new_file_1');
      assert(driver.findElement({css: '#tests ul li:nth-child(1)'}).getText()).equalTo('All (2 files)');
      assert(driver.findElement({css: '#tests ul li:nth-child(2)'}).getText()).equalTo('google_search');
      assert(driver.findElement({css: '#tests ul li:nth-child(3)'}).getText()).equalTo('new_file_1');
      driver.findElement({css: '.ReactCodeMirror textarea'}).getText()
        .then(text => {
          assert(text.replace(/[\n\s]/g, '')).equalTo(NEW_FILE_TPL.replace(/[\n\s]/g, ''));
        });
    });

    test.it('should run without errors', function () {
      driver.findElement({id: 'run'}).click();
      driver.wait(until.titleContains('done'));
      driver.findElements({css: '.report-tab .console'}).then(elems => assert(elems.length).equalTo(0));
      assert(driver.findElement({css: '#mocha-stats .failures em'}).getText()).equalTo('0');
      assert(driver.findElement({css: '#mocha-stats .passes em'}).getText()).equalTo('1');
    });

    test.it('should be deleted', function () {
      driver.findElement({css: '#editor [data-test-id="delete"]'}).click();
      // todo: use driver.wait(until.alertIsPresent)
      driver.sleep(200);
      driver.switchTo().alert().accept();
      assert(driver.findElement({css: '#tests ul li:nth-child(1)'}).getText()).equalTo('All (1 file)');
      assert(driver.findElement({css: '#tests ul li:nth-child(2)'}).getText()).equalTo('google_search');
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
