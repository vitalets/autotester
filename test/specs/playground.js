
'use strict';


let driver = new Driver();
driver.get('http://yandex.ru');
driver.getTitle().then(title => {
  console.log('Title:', title)
});
driver.navigate().newTab('http://mail.ru');

driver.quit();


/*
var webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until;

var driver = new webdriver.Builder()
  .forBrowser('chrome')
  .build();

driver.get('http://www.google.com/ncr');
driver.findElement(By.name('q')).sendKeys('webdriver')//.then(() => wwww())
driver.findElement(By.name('btnG')).click();
//qqq();
driver.wait(until.titleIs('webdriver - Google Search'), 1000);
driver.getTitle().then(title => {
  console.log(title)
});
driver.quit();
*/


/*
var webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until,
  Browser = webdriver.Browser,
  assert = require('selenium-webdriver/testing/assert'),
  test = require('selenium-webdriver/lib/test');

test.suite(function(env) {
  var driver;

  test.before(function () {
    driver = env.builder().build();
  });

  test.after(function () {
    driver.quit();
  });

  test.beforeEach(function () {
    driver.get(test.Pages.echoPage);
  });

  describe('executeScript;', function () {

    test.it('should append query to title', function() {

      driver.get('http://www.google.com/ncr').then(() =>  qqq())
      assert(driver.getTitle()).equalTo('Google');
    });

  });

});
*/
