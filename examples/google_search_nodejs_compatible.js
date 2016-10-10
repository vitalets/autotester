/**
 * Test is the same as own selenium example from `selenium-webdriver/exampels/google_search_test.js`
 * But Autotester can execute it also.
 */

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    Key = webdriver.Key,
    until = webdriver.until,
    test = require('selenium-webdriver/testing');

test.describe('Google Search (nodejs compatible)', function() {
  var driver;

  test.before(function() {
    driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();
  });

  test.after(function() {
    driver.quit();
  });

  test.it('should append query to title (nodejs compatible)', function() {
    driver.get('http://www.google.com');
    driver.findElement(By.name('q')).sendKeys('kitten' + Key.ENTER);
    driver.wait(until.titleContains('kitten'), 2000);
    driver.sleep(1000);
  });
});
