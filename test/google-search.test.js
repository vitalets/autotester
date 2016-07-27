
const test = require('selenium-webdriver/testing');

test.describe('Google Search', function() {

  test.before(function() {
    driver.get('http://www.google.com');
  });

  test.it('should append query to title', function() {
    driver.findElement(By.name('q')).sendKeys('webdriver');
    driver.findElement(By.name('btnG')).click();
    driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  });

  test.after(function() {
    driver.quit();
  });

});
