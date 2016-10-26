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

  test.it('should add new file from template', function () {
    driver.findElement({css: '.no-file-selected button'}).click();
    const filename = driver.wait(until.elementLocated({css: '#textfield-Filename'}));
    assert(filename.getAttribute('value')).equalTo('new_file_1');
    const tpl = `
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
    driver.findElement({css: '.ReactCodeMirror textarea'}).getText()
      .then(text => {
        assert(text.replace(/[\n\s]/g, '')).equalTo(tpl.replace(/[\n\s]/g, ''));
      });
  });

  test.it('should successfully run newly created file', function () {
    driver.findElement({css: '.no-file-selected button'}).click();
    driver.findElement({id: 'run'}).click();
    driver.wait(until.titleContains('done'));
    driver.findElements({css: '.report-tab .console'}).then(elems => assert(elems.length).equalTo(0));
    assert(driver.findElement({css: '#mocha-stats .failures em'}).getText()).equalTo('0');
    assert(driver.findElement({css: '#mocha-stats .passes em'}).getText()).equalTo('1');
  });
});
