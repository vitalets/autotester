
'use strict';


// let driver = new Driver();
// driver.get('https://google.ru');
// // driver.findElement(By.name('q')).sendKeys('yandex')//.then(() => wwww())
// // driver.findElement(By.name('btnG')).click();
//
// driver.getCurrentUrl().then(result => {
//   console.log('result:', result)
// });

//driver.findElement({css: '.__altsearch_ext_root__'}).then(() => console.log('found!'))

//driver.navigate().newTab('http://mail.ru');

//driver.quit();

// demo

/*
test.describe('demo', function() {
  let driver;

  test.before(function() {
    driver = new Driver();
  });

  test.after(function() {
    driver.quit();
  });

  // altsearch
  test.it('should show panel on google result page', function() {
    driver.get('https://google.ru');
    driver.findElement(By.name('q')).sendKeys('yandex');
    driver.findElement(By.name('btnG')).click();
    const panel = driver.wait(until.elementLocated({css: '.__altsearch_ext_root__ /deep/ .altsearch__text'}), 3000);
    assert(panel.getText()).equalTo('Не нашли нужное? Поищите yandexв');
  });

  // yobject
  test.it('should show yobject on lenta.ru page from promo', function() {
    driver.get('https://lenta.ru/news/2016/01/24/serov/');
    const article = driver.wait(until.elementLocated({css: '.yobject-marked'}), 3000);
    const yobjectItem = article.findElement({css: 'yobject'});
    assert(yobjectItem.getText()).equalTo('Валентина Серова');
    yobjectItem.click();
    const badgeTitle = driver.wait(until.elementLocated({css: '#yinfo-badge /deep/ .yinfo-badge__body a'}), 3000);
    assert(badgeTitle.getText()).equalTo('Серов Валентин');
  });

  // vb
  test.it.only('should open yandex from first thumb with correct clid', function() {
    driver.get('chrome://newtab');
    const firstThumb = driver.wait(until.elementLocated({css: '.b-tumbs__item_index_0'}), 3000);
    driver.requests().catch();
    firstThumb.click();
    driver.wait(until.titleIs('Яндекс'), 3000);
    driver.requests().stop();
    assert(driver.requests().getCount({url: 'https://www.yandex.ru/?clid=2063711'})).equalTo(1);
  });
});
*/



var webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until;

var driver = new webdriver.Builder()
  .forBrowser('chrome')
  .build();

driver.get('http://www.google.com/ncr');
// driver.findElement(By.name('q')).sendKeys('webdriver')//.then(() => wwww())
// driver.findElement(By.name('btnG')).click();

//driver.wait(until.titleIs('webdriver - Google Search'), 1000);
driver.getCurrentUrl().then(res => {
  console.log('res', res)
});
driver.quit();



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
