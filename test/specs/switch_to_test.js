
'use strict';

var assert = require('../testing/assert');
var test = require('../lib/test');

test.suite(function (env) {
  var driver;

  test.before(function () {
    driver = env.builder().build();
  });

  test.after(function () {
    driver.quit();
  });

  describe('switchTo', function() {

    describe('extension background', function () {

      test.it('should contain extension background handler', function () {
        driver.getAllWindowHandles().then(handles => {
          assert(handles.indexOf(runContext.simpleExtension.handle) >= 0).equalTo(true);
        });
      });

      test.it('should exclude autotester background handler', function () {
        driver.getAllWindowHandles().then(handles => {
          const handle = `extension-${chrome.runtime.id}`;
          assert(handles.indexOf(handle) >= 0).equalTo(false);
        });
      });

      test.it('should execute sync script', function () {
        driver.switchTo().window(runContext.simpleExtension.handle);
        const manifestVersion = driver.executeScript(function () {
          return chrome.runtime.getManifest().manifest_version;
        });
        assert(manifestVersion).equalTo(2);
      });

      test.it('should execute async script', function () {
        driver.switchTo().window(runContext.simpleExtension.handle);
        const popup = driver.executeAsyncScript(function () {
          chrome.browserAction.getPopup({}, arguments[arguments.length - 1]);
        });
        assert(popup).equalTo(runContext.simpleExtension.popup);
      });

    });

    describe('new tab', function() {

      test.it('should switch to new tab with http url', function () {
        driver.switchTo().newTab(test.Pages.simpleTestPage);
        assert(driver.getCurrentUrl()).equalTo(test.Pages.simpleTestPage);
      });

      test.it('should switch to new tab with empty url (as "about:blank")', function () {
        driver.switchTo().newTab();
        assert(driver.getCurrentUrl()).equalTo('about:blank');
      });

      test.it('should switch to new tab with extension url', function () {
        driver.switchTo().newTab(runContext.simpleExtension.popup);
        assert(driver.getCurrentUrl()).equalTo(runContext.simpleExtension.popup);
      });

    });

  });

});
