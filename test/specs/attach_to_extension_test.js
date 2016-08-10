'use strict';

var webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until,
  Browser = webdriver.Browser,
  assert = require('selenium-webdriver/testing/assert'),
  test = require('selenium-webdriver/lib/test');


test.suite(function (env) {
  var driver;

  test.before(function () {
    driver = env.builder().build();
    driver.getAllWindowHandles()
      .then(handles => handles.filter(h => h.startsWith('extension-'))[0])
      .then(handle => driver.switchTo().window(handle));
  });

  test.after(function () {
    driver.quit();
  });

  describe.only('extension background page', function() {

    test.it('should execute sync script', function () {
      const manifestVersion = driver.executeScript(function() {
        return chrome.runtime.getManifest().manifest_version;
      });
      assert(manifestVersion).equalTo(2);
    });

    test.it('should execute async script', function () {
      const title = driver.executeAsyncScript(function() {
        const callback = arguments[arguments.length - 1];
        chrome.browserAction.getTitle({}, callback);
      });
      assert(title).equalTo('Визуальные закладки');
    });

  })

});
