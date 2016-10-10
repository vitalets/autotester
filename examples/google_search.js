/**
 * Simple google search test
 */

test.describe('Google Search', function() {
  var driver;

  test.before(function () {
    driver = new Driver();
  });

  test.after(function () {
    driver.quit();
  });

  test.it('should append query to title', function() {
    driver.get('http://www.google.com');
    driver.findElement(By.name('q')).sendKeys('kitten');
    driver.sleep(1000);
    driver.findElement(By.name('q')).sendKeys(Key.ENTER);
    driver.wait(until.titleContains('kitten'), 2000);
    driver.sleep(1000);
  });

});
