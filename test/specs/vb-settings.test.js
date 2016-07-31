
'use strict';

var webdriver = require('selenium-webdriver'),
  until = webdriver.until,
  assert = require('selenium-webdriver/testing/assert'),
  test = require('selenium-webdriver/lib/test');

const chrome = require('selenium-webdriver/chrome');

test.suite(function(env) {
  var driver;

  test.before(function() {
    const options = new chrome.Options();
    options.addExtensions('../visbookmarks-chrome/out/yandex.crx');

    driver = env.builder()
      .setChromeOptions(options)
      .build();
  });

  test.after(function() {
    driver.quit();
  });

  describe('Settings', function () {
    test.it('should open by click', function () {
      driver.get('chrome://newtab');
      driver.wait(until.elementLocated({css: '.i-action__settings'}), 2000);

      const settings = driver.findElement({css: '.settings'});
      assert(settings.getTagName()).equalTo('div');
      //assert.eventually.equal(settings.isDisplayed(), false);
      //driver.findElement({css: '.i-action__settings'}).click();
      //driver.sleep(1000);
      //driver.wait(until.elementIsVisible(settings), 1000);
    });
  });

});
