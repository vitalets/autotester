/**
 * Simple google search test
 */

test.describe('Google Search', function() {
  var driver;

  test.before(function() {
    driver = new Driver();
  });

  test.it('should contain "google" in title', function() {
    driver.get('http://www.google.com');
    assert(driver.getTitle()).contains('Google');
  });

  test.it('should append query to title', function() {
    driver.get('http://www.google.com');
    driver.findElement(By.name('q')).sendKeys('webdriver' + Key.ENTER);
    driver.wait(until.titleContains('webdriver'), 2000);
  });

  test.after(function() {
    driver.quit();
  });
});
