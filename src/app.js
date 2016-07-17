

const Driver = require('./driver');
const By = require('selenium-webdriver/lib/by').By;
const until = require('selenium-webdriver/lib/until');

const driver = new Driver();

window.addEventListener('error', e => {
  const message = e.error && e.error.message || e.message;
  console.error(`${message} ${e.filename}:${e.lineno}`);
});

/*
driver.get('http://www.google.com/ncr');
const el = driver.findElement(By.name('q'));
el.sendKeys('we');
driver.sleep(1000);
driver.findElement(By.name('btnG')).click();
driver.wait(until.titleIs('we - Google Search'), 5000);
driver.quit();
*/

/*
driver.get('http://www.yandex.ru');
const el = driver.findElement(By.name('text'));
el.sendKeys('we');
driver.sleep(1000);
driver.findElement(By.css('.search2__button button')).click();
driver.wait(until.titleContains('we'), 5000);
driver.quit();
*/

// with frames
driver.get('http://www.about.com/');
//driver.findElement(By.id('main')).then(() => console.log('elem found'));
//driver.getAllWindowHandles().then(res => console.log(res));
//driver.switchTo().frame(1);
//driver.findElement(By.id('main')).then(() => console.log('elem found'));
driver.quit().then(() => console.log('ok'));
