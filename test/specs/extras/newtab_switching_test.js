'use strict';

var assert = require('../testing/assert');
var test = require('../lib/test');

test.suite(function (env) {
  var driver;
  var initialHandle;

  test.before(function () {
    driver = env.builder().build();
    driver.getWindowHandle().then(handle => initialHandle = handle);
  });

  test.beforeEach(function () {
    driver.switchTo().window(initialHandle);
    driver.get('about:blank');
  });

  test.after(function () {
    driver.quit();
  });

  describe('newtab switching', function () {

    test.it('should switch to new tab with empty url (as "about:blank")', function () {
      driver.switchTo().newTab();
      assert(driver.getCurrentUrl()).equalTo('about:blank');
    });

    test.it('should switch to new tab with specified url', function () {
      driver.switchTo().newTab(test.Pages.simpleTestPage);
      assert(driver.getCurrentUrl()).equalTo(test.Pages.simpleTestPage);
    });

  });

});
