
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

  describe('switchTo', function() {

    describe('extension', function () {

      describe('background', function () {

        test.it('should contain extension background handler', function () {
          driver.getAllWindowHandles().then(handles => {
            assert(handles.indexOf(runContext.simpleExtension.handle) >= 0).equalTo(true);
          });
        });

        test.it('should exclude autotester background handler', function () {
          driver.getAllWindowHandles().then(handles => {
            const handle = `extension-${chrome.runtime.id}`;
            assert(handles.indexOf(handle)).equalTo(-1);
          });
        });

        test.it('should switch and call command', function () {
          driver.switchTo().window(runContext.simpleExtension.handle);
          assert(driver.getCurrentUrl()).equalTo(runContext.simpleExtension.bg);
        });

        test.it('should access chrome api', function () {
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

        test.it('should switch via .extension(id)', function () {
          driver.switchTo().extension(runContext.simpleExtension.id);
          assert(driver.getCurrentUrl()).equalTo(runContext.simpleExtension.bg);
        });

        test.it('should switch via .extension() without id to first available extension', function () {
          driver.switchTo().extension();
          assert(driver.getCurrentUrl()).startsWith('chrome-extension://');
        });

      });

      describe('popup', function () {

        test.it('should navigate to popup url', function () {
          driver.get(runContext.simpleExtension.popup);
          assert(driver.getCurrentUrl()).equalTo(runContext.simpleExtension.popup);
        });

        test.it('should open newtab with popup url', function () {
          driver.switchTo().newTab(runContext.simpleExtension.popup);
          assert(driver.getCurrentUrl()).equalTo(runContext.simpleExtension.popup);
        });

        test.it('should access chrome api in popup', function () {
          driver.get(runContext.simpleExtension.popup);
          const manifestVersion = driver.executeScript(function () {
            return chrome.runtime.getManifest().manifest_version;
          });
          assert(manifestVersion).equalTo(2);
        });

      });

    });

    describe('new tab', function() {

      test.it('should switch to new tab with empty url (as "about:blank")', function () {
        driver.switchTo().newTab();
        assert(driver.getCurrentUrl()).equalTo('about:blank');
      });

      test.it('should switch to new tab and navigate to specified url', function () {
        driver.switchTo().newTab(test.Pages.simpleTestPage);
        assert(driver.getCurrentUrl()).equalTo(test.Pages.simpleTestPage);
      });

    });

  });

});
