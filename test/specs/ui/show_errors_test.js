test.describe('show errors', function () {
  let driver;

  const {runCode, getConsoleLines, textToLines, page} = runContext;

  test.before(function () {
    driver = runContext.driver = new Driver();
    driver.get(runContext.selftest.ui);
    driver.wait(until.titleContains('ready'));
  });

  test.after(function () {
    driver.quit();
  });

  test.describe('without test-runner', function () {

    test.it('should show error in syntax before driver started', function () {
      runCode(`
        abc()
      `);
      getConsoleLines().then(lines => {
        assert(lines[0]).equalTo('ReferenceError: abc is not defined');
        assert(lines[1]).equalTo('at runtime/undefined.js:2:9');
      })
    });

    test.it('should show error inside driver flow', function () {
      runCode(`
        const driver = new Driver();
        driver.call(() => {
          abc()
        });
      `);
      getConsoleLines().then(lines => {
        assert(lines[0]).equalTo('ReferenceError: abc is not defined');
        assert(lines[1]).equalTo('at driver.call (runtime/undefined.js:4:11)');
      })
    });

    test.it('should show Webdriver error', function () {
      runCode(`
        const driver = new Driver();
        driver.findElement({css: 'abc'});
      `);
      getConsoleLines().then(lines => {
        assert(lines[0]).equalTo('NoSuchElementError: Element not found by abc');
      })
    });

  });

  test.describe('with test-runner', function () {

    test.it('should show syntax error in describe()', function () {
      runCode(`
        test.describe('suite', function () {
          abc();
        })
      `);
      getConsoleLines().then(lines => {
        assert(lines[0]).equalTo('ReferenceError: abc is not defined');
        assert(lines[1]).equalTo('at Suite.<anonymous> (runtime/undefined.js:3:11)');
      });
    });

    test.it('should show syntax error in it()', function () {
      runCode(`
        test.describe('suite', function () {
          test.it('test', function () {
            abc();
          })
        })
      `);
      getMochaErrorLines().then(lines => {
        assert(lines[0]).equalTo('ReferenceError: abc is not defined');
        assert(lines[1]).equalTo('at Context.<anonymous> (runtime/undefined.js:4:13)');
      })
    });

    test.it('should show error in driver flow', function () {
      runCode(`
        test.describe('suite', function () {
          let driver;
          test.it('test', function () {
            driver = new Driver();
            driver.call(() => {
              abc()
            })
          })
          test.after(function () {
            driver.quit();
          })
        })
      `);
      getMochaErrorLines().then(lines => {
        assert(lines[0]).equalTo('ReferenceError: abc is not defined');
        assert(lines[1]).equalTo('at driver.call (runtime/undefined.js:7:15)');
      })
    });

    test.it('should show Webdriver error', function () {
      runCode(`
        test.describe('suite', function () {
          let driver;
          test.it('test', function () {
            driver = new Driver();
            driver.findElement({css: 'abc'});
          })
          test.after(function () {
            driver.quit();
          })
        })
      `);
      getMochaErrorLines().then(lines => {
        assert(lines[0]).equalTo('NoSuchElementError: Element not found by abc');
      })
    });

  });

  function getMochaErrorLines() {
    return driver.findElement(page.report.error).getText()
      .then(textToLines)
      .catch(() => [])
  }
});

