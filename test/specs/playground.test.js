
'use strict';

var By = require('selenium-webdriver').By,
  until = require('selenium-webdriver').until,
  assert = require('selenium-webdriver/testing/assert'),
  test = require('selenium-webdriver/lib/test');

test.suite(function(env) {
  var driver;

  test.before(function() {
    driver = env.builder().build();
  });

  test.after(function() {
    driver.quit();
  });

  test.it('should pass playground', function () {
    driver.get('https://yandex.ru');

    driver.executeScript('console.log(arguments); return arguments[1];', 1, '2', [1, 2], {x: 'abc'});
  });

});

