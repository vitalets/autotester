/**
 * Simple google search test
 */

test.describe('Google Search', function() {

  test.it('should append query to title', function() {
    var driver = new Driver();
    driver.get('http://www.google.com');
    driver.findElement(By.name('q')).sendKeys('webdriver');
    driver.sleep(1000);
    driver.findElement(By.name('q')).sendKeys(Key.ENTER);
    driver.wait(until.titleContains('webdriver'), 2000);
    driver.quit();
  });

});
