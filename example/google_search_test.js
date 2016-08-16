/**
 * Simple google search test to be executed with Autotester
 * Test is written in BDD style and executed with mocha.
 * Difference with mocha test is that you are not using global `describe`, `it` etc
 * Instead you are using `test.describe`, `test.it`.
 * There are some globals available for convenience:
 * - Driver
 * - By
 * - until
 * - test
 * - console
 * - ...
 */

test.describe('Google Search', function() {
  var driver;

  test.before(function() {
    driver = new Driver();
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
