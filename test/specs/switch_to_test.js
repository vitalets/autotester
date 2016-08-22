
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

  describe('switchTo', function() {

    describe('extension background page', function () {

      test.beforeEach(function () {
        driver.getAllWindowHandles()
          .then(handles => handles.filter(h => h.startsWith('extension-'))[0])
          .then(handle => driver.switchTo().window(handle));
      });

      test.it('should execute sync script', function () {
        const manifestVersion = driver.executeScript(function () {
          return chrome.runtime.getManifest().manifest_version;
        });
        assert(manifestVersion).equalTo(2);
      });

      test.it('should execute async script', function () {
        const title = driver.executeAsyncScript(function () {
          const callback = arguments[arguments.length - 1];
          chrome.browserAction.getTitle({}, callback);
        });
        assert(title).equalTo('Визуальные закладки');
      });

    });

    describe('new tab', function() {

      test.it('should switch to new tab', function () {
        driver.switchTo().newTab(test.Pages.simpleTestPage);
        assert(driver.getCurrentUrl()).equalTo(test.Pages.simpleTestPage);
      });

      test.it('should switch to about:blank if no url provided', function () {
        driver.switchTo().newTab();
        assert(driver.getCurrentUrl()).equalTo('about:blank');
      });

    });

  });

});
