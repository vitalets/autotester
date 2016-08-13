
'use strict';

let driver = new Driver();
driver.get('http://yandex.ru');
driver.getTitle().then(title => console.log(title));
driver.quit();

/*
var webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until,
  Browser = webdriver.Browser,
  assert = require('selenium-webdriver/testing/assert'),
  test = require('selenium-webdriver/lib/test');

test.suite(function(env) {
  var driver;

  test.before(function () {
    driver = env.builder().build();
  });

  test.after(function () {
    driver.quit();
  });

  test.beforeEach(function () {
    driver.get(test.Pages.echoPage);
  });

  describe('executeScript;', function () {

    test.it('async', function() {
      driver.executeAsyncScript(function () {
          const callback = arguments[arguments.length - 1];
          setTimeout(() => callback(123), 1000);
        })
        .then(res => console.log('res', res));
    });

    test.it('can pass null arguments', function() {
      assert(execute('return arguments[0] === null', null)).equalTo(true);
      assert(execute('return arguments[0]', null)).equalTo(null);
    });

  });

  function verifyJson(expected) {
    return function(actual) {
      assert(JSON.stringify(actual)).equalTo(JSON.stringify(expected));
    };
  }

  function execute() {
    return driver.executeScript.apply(driver, arguments);
  }
});
*/
