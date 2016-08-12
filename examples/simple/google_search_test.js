/**
 * Simple google search test to be executed with Autotester
 * There are some globals available for conveniency:
 * - Driver
 * - By
 * - until
 * - test
 * - report (!)
 * - ...
 */

test.describe('Google Search', function() {
  var driver;

  test.before(function() {
    driver = new Driver();
  });

  test.it('should append query to title', function() {
    driver.get('http://www.google.com/ncr');
    driver.findElement(By.name('q')).sendKeys('autotester');
    driver.findElement(By.name('btnG')).click();
    driver.wait(until.titleIs('autotester - Google Search'), 1000);
  });

  test.after(function() {
    driver.quit();
  });
});
