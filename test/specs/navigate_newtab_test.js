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

  describe.only('navigation', function() {

    test.it('should open new tab', function () {
      let oldCount;
      driver.getAllWindowHandles().then(handles => oldCount = handles.length);
      driver.navigate().newTab(test.Pages.echoPage);
      driver.getAllWindowHandles().then(handles => {
        assert(handles.length).equalTo(oldCount + 1);
      });
    });

  })

});
