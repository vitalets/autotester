/**
 * Test similar to own selenium from `selenium-webdriver/exampels/google_search_test.js`
 * But it can be executed via both Selenium webdriverjs or Autotester
 */

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    test = require('selenium-webdriver/testing');

test.describe('Google Search', function() {
  var driver;

  test.before(function() {
    driver = new webdriver.Builder()
        .forBrowser('firefox') // 'firefox' here has no effect for Autotester, it will run in chrome anyway :)
        .build();
  });

  test.it('should append query to title', function() {
    driver.get('http://www.google.com');
    driver.findElement(By.name('q')).sendKeys('webdriver');
    driver.findElement(By.name('btnG')).click();
    driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  });

  test.after(function() {
    driver.quit();
  });
});
