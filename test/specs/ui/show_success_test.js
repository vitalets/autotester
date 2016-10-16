test.describe('show success', function () {
  let driver;

  const {runCode, getConsoleLines} = runContext;

  test.before(function () {
    driver = runContext.driver = new Driver();
    driver.get(runContext.selftest.ui);
    driver.wait(until.titleContains('ready'));
  });

  test.after(function () {
    driver.quit();
  });

  test.it('should show console messages', function () {
    runCode(`console.log('hello', 1)`);
    getConsoleLines().then(lines => {
      assert(lines[0]).equalTo('hello 1');
    })
  });

  test.it('should show mocha report', function () {
    runCode(`
      test.describe('suite', function () {
        test.it('test', function () {
          assert(true).equalTo(true);
        })
      })
    `);
    driver.findElement({id: 'mocha-report'}).getText().then(text => {
      assert(text).contains('suitetest');
      assert(text).contains('assert(true).equalTo(true);');
    })
  });

  test.it.skip('should show custom report', function () {
    runCode(`report.textContent = 'hello'`);
    assert(driver.findElement({id: 'report'}).getText()).equalTo('hello');
  });

});
