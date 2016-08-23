
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

    const EXTENSION_ID = 'okmmklebfnaockijmhpkoilemnfcbeic';
    const EXTENSION_BG_HANDLE = `extension-${EXTENSION_ID}`;

    describe('extension background', function () {

      test.beforeEach(function () {
        driver.getAllWindowHandles()
          .then(handles => handles.filter(h => h.startsWith('extension-'))[0])
          .then(handle => driver.switchTo().window(handle));
      });

      test.it('should return extension background handler', function () {
        driver.getAllWindowHandles().then(handles => {
          assert(handles.indexOf(EXTENSION_BG_HANDLE) >= 0).equalTo(true);
        });
      });

      test.it('should return exclude autotester background handler', function () {
        driver.getAllWindowHandles().then(handles => {
          const handle = `extension-${chrome.runtime.id}`;
          assert(handles.indexOf(handle) >= 0).equalTo(false);
        });
      });

      test.it('should execute sync script', function () {
        driver.switchTo().window(EXTENSION_BG_HANDLE);
        const manifestVersion = driver.executeScript(function () {
          return chrome.runtime.getManifest().manifest_version;
        });
        assert(manifestVersion).equalTo(2);
      });

      test.it('should execute async script', function () {
        driver.switchTo().window(EXTENSION_BG_HANDLE);
        const popup = driver.executeAsyncScript(function () {
          chrome.browserAction.getPopup({}, arguments[arguments.length - 1]);
        });
        assert(popup).equalTo(`chrome-extension://${EXTENSION_ID}/popup.html`);
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
        driver.switchTo().window(EXTENSION_BG_HANDLE);
        const popup = driver.executeAsyncScript(function () {
          chrome.browserAction.getPopup({}, arguments[arguments.length - 1]);
        });
        popup.then(popupUrl => {
          driver.switchTo().newTab(popupUrl);
          assert(driver.getCurrentUrl()).equalTo(popupUrl);
        });
      });

    });

  });

});
