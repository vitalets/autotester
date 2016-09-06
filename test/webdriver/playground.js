
'use strict';

var webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until,
  Key = webdriver.Key,
  test = require('selenium-webdriver/testing');


// =======

// const driver = new Driver();
// driver.get('https://ya.ru');
// driver.sleep(1000);
// driver.findElement(By.name('text')).sendKeys('qwertty');
// driver.sleep(1000);
// //setTimeout(() => sadfsdf, 10)
// sdfgs
//
// driver.call(() => {
//   xxx();
// });
//
// driver.quit();



/*
test.describe('Yandex Search', function() {

  var driver;
  test.before(function() {
    driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build();
  });

  test.it('should append query to title', function() {
    driver.get('https://ya.ru');
    driver.sleep(1000);

    driver.findElement(By.name('text')).sendKeys('hello');
    driver.sleep(1000);

    // driver.call(() => {
    //   xxx();
    // });

    assert(driver.getTitle()).equalTo('adsfgadfg')
    //assert(1).equalTo(2)

    //assert.equal(1, 2)
    // throw new Error('abc')

    //driver.findElement(By.name('text')).submit();
   // driver.findElement(By.name('text')).sendKeys(Key.ENTER);

  });

  test.after(function() {
    driver.quit();
  });
});
*/

// let driver = new Driver();
//
// driver.get('chrome://newtab');
//driver.wait(until.elementLocated(By.className('b-tumbs__item_index_0')), 3000);

// переключаемся в бэкграуд ВЗ (пока просто по id, потом сделаем универсально)
//driver.switchTo().extension('nkcpopggjcjkiicpenikeogioednjeac');


//
 //driver.get('https://google.ru');
// // // driver.findElement(By.name('q')).sendKeys('yandex')//.then(() => wwww())
// // // driver.findElement(By.name('btnG')).click();

// driver.getCurrentUrl().then(result => {
//   console.log('result1:', result)
// });
//
// //driver.findElement({css: '.__altsearch_ext_root__'}).then(() => console.log('found!'))
//
// driver.navigate().newTab('http://mail.ru');
//
// driver.getCurrentUrl().then(result => {
//   console.log('result2:', result)
// });
//
// driver.quit();



/*
var driver = new webdriver.Builder()
  .forBrowser('chrome')
  .build();

driver.get('http://www.google.com/ncr');
driver.findElements(By.name('q'))
//driver.findElement(By.name('q')).sendKeys('webdriver')//.then(() => wwww())
// driver.findElement(By.name('btnG')).click();

//driver.wait(until.titleIs('webdriver - Google Search'), 1000);
// driver.getCurrentUrl().then(res => {
//   console.log('res', res)
// });
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
