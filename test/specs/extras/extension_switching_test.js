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

  describe('extension switching', function () {

    describe('background', function () {

      test.it('should contain extension background handler', function () {
        driver.getAllWindowHandles().then(handles => {
          assert(handles.indexOf(runContext.selftest.handle) >= 0).equalTo(true);
        });
      });

      test.it('should exclude autotester background handler', function () {
        driver.getAllWindowHandles().then(handles => {
          const handle = `extension-${chrome.runtime.id}`;
          assert(handles.indexOf(handle)).equalTo(-1);
        });
      });

      test.it('should switch and call command', function () {
        driver.switchTo().window(runContext.selftest.handle);
        assert(driver.getCurrentUrl()).equalTo(runContext.selftest.bg);
      });

      test.it('should access chrome api', function () {
        driver.switchTo().window(runContext.selftest.handle);
        const manifestVersion = driver.executeScript(function () {
          return chrome.runtime.getManifest().manifest_version;
        });
        assert(manifestVersion).equalTo(2);
      });

      test.it('should execute async script', function () {
        driver.switchTo().window(runContext.selftest.handle);
        const popup = driver.executeAsyncScript(function () {
          chrome.browserAction.getTitle({}, arguments[arguments.length - 1]);
        });
        assert(popup).equalTo('Autotester');
      });

      test.it('should switch via .extension(id)', function () {
        driver.switchTo().extension(runContext.selftest.id);
        assert(driver.getCurrentUrl()).equalTo(runContext.selftest.bg);
      });

      test.it('should switch via .extension() without id to first available extension', function () {
        driver.switchTo().extension();
        assert(driver.getCurrentUrl()).startsWith('chrome-extension://');
      });

      test.it('should not fail on several .extension() calls', function () {
        driver.switchTo().extension(runContext.selftest.id);
        driver.switchTo().extension(runContext.selftest.id);
      });

    });

    describe('tab with extension url', function () {

      test.it('should navigate', function () {
        driver.get(runContext.selftest.ui);
        assert(driver.getCurrentUrl()).equalTo(runContext.selftest.ui);
      });

      test.it('should open as newtab', function () {
        driver.switchTo().newTab(runContext.selftest.ui);
        assert(driver.getCurrentUrl()).equalTo(runContext.selftest.ui);
      });

      test.it('should access chrome api', function () {
        driver.get(runContext.selftest.ui);
        const manifestVersion = driver.executeScript(function () {
          return chrome.runtime.getManifest().manifest_version;
        });
        assert(manifestVersion).equalTo(2);
      });

    });

  });

});
