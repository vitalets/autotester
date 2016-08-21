/**
 * Attaching to extensions api requires these two flag to be set:
 *
 * --silent-debugger-extension-api
 * --extensions-on-chrome-urls
 *
 * About warning: https://bugs.chromium.org/p/chromium/issues/detail?id=475151
 */

'use strict';

var webdriver = require('selenium-webdriver');
var assert = require('selenium-webdriver/testing/assert');
var test = require('selenium-webdriver/lib/test');

test.suite(function (env) {
  var driver;

  test.before(function () {
    driver = env.builder().build();
  });

  test.after(function () {
    driver.quit();
  });

  describe('switchto', function() {

    test.it('should switch to new tab', function () {
      driver.get(test.Pages.echoPage);
      driver.switchTo().newTab(test.Pages.simpleTestPage);
      assert(driver.getTitle()).equalTo('Hello WebDriver');
    });

  })

});
