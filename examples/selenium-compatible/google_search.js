/**
 * Example similar to own selenium from `selenium-webdriver/exampels/google_search.js`
 * But it can be executed via both Selenium webdriverjs or Autotester
 */

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('firefox') // 'firefox' here has no effect for Autotester, it will run in chrome anyway :)
    .build();

driver.get('http://www.google.com/ncr');
driver.findElement(By.name('q')).sendKeys('webdriver');
driver.findElement(By.name('btnG')).click();
driver.wait(until.titleContains('webdriver'), 2000);
driver.getTitle().then(title => {
  console.log('Title is:', title);
});
driver.quit();
