'use strict';

var assert = require('../testing/assert');
var test = require('../lib/test');

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

  describe('catch network requests', function () {

    test.it.only('should catch normal navigation', function () {
      driver.requests().catch();
      driver.get(test.Pages.echoPage);
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.Pages.echoPage})).equalTo(1);
    });

  });

});
