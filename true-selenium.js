'use strict';

const webdriver = require('selenium-webdriver');
// const test = require('selenium-webdriver/testing');

let chrome = require('selenium-webdriver/chrome');

// use chromedriver built with full logging
let service = new chrome.ServiceBuilder('/Users/vitalets/projects/chromium/src/out/Default/chromedriver')
  .usingPort(9515)
  .loggingTo('./log.txt')
  .enableVerboseLogging()
  .build();

chrome.setDefaultService(service);

let options = new chrome.Options();
options.addExtensions('../visbookmarks-chrome/out/yandex.crx');
// options.addArguments('--start-maximized');

//const logging = webdriver.logging;
/*
const prefs = new logging.Preferences();
prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
prefs.setLevel(logging.Type.CLIENT, logging.Level.ALL);
prefs.setLevel(logging.Type.DRIVER, logging.Level.ALL);
prefs.setLevel(logging.Type.PERFORMANCE, logging.Level.ALL);
prefs.setLevel(logging.Type.SERVER, logging.Level.ALL);
options.setLoggingPrefs(prefs);
*/

//logging.installConsoleHandler();
//logging.getLogger('webdriver').setLevel(logging.Level.FINER);


let driver = new webdriver.Builder()
  .forBrowser('chrome')
  // dont use capabilities here as they are overwritten by setChromeOptions
  .setChromeOptions(options)
  .build();

global.driver = driver;
global.By = webdriver.By;
global.Key = webdriver.Key;
global.until = webdriver.until;
// this does not work as mocha set's globals later
// global.test = test;

// todo: use mocha programmatically!!!

// sample: mocha --require ./true-selenium --harmony -t 600000 --recursive ./test/google-search.test.js

// quit driver in case of error
//webdriver.promise.controlFlow().on('uncaughtException', function(e) {
//  console.error(e);
//  // driver.quit();
//});

// driver.sleep(10000);
// driver.get('http://www.yandex.ru');
//driver.get('http://www.google.com/ncr');
//driver.get('chrome://newtab');


//driver.executeScript(function () {
//  document.addEventListener('keydown', e => console.log('keydown', e.keyCode, e.keyIdentifier));
//});
//
//driver.sleep(10000);
//
//const el = driver.findElement({css: '.i-action__settings'});
////const el = driver.findElement({css: '.b-head-logo__link'});
//el.getLocation().then(res => console.log(res));
//el.getSize().then(res => console.log(res));
//// el.click();
//
//driver.sleep(1000);

////const el = driver.findElement(By.name('text'));
//const el = driver.findElement({css: 'a[href="https://news.yandex.ru/?lang=ru"]'});
//driver.actions()
//  .keyDown(Key.COMMAND)
// // .keyDown(Key.SHIFT)
//  .click(el)
//  .keyUp(Key.SHIFT)
//  .perform();
//
//driver.sleep(1000);
// driver.manage().window().maximize();
//driver.get('http://www.about.com/');
//driver.get('http://www.google.com/ncr');
// driver.findElement(By.name('text')).sendKeys('й');
//driver.findElement(By.name('q')).sendKeys(Key.SHIFT + '5');
//driver.findElement(By.name('q')).sendKeys('w');
//driver.actions()
 //.keyDown(Key.SHIFT)
 // .keyDown(Key.CONTROL)
  // .sendKeys(Key.SHIFT)
  // .sendKeys('Q')
  // .keyUp(Key.SHIFT)
 // .keyDown(Key.SHIFT)
 // .perform();



//driver.findElements(By.id('main')).then(res => console.log('elem found', res));
//driver.findElements({css: 'div1'}).then(res => console.log('elem found', res));

//driver.actions()
  // .keyDown(input.Key.SHIFT)
  //.click(el)
  //.perform();

//driver.getAllWindowHandles().then(res => {
//  console.log('switch to ', res[1]);
//  driver.switchTo().window(res[1]);
//
//  driver.actions()
//    .sendKeys('q')
//    .perform();
//
//  driver.findElement(By.name('text')).sendKeys('e');
//
//  driver.switchTo().window(res[0]);
//
//  driver.actions()
//    .sendKeys('w')
//    .perform();
//});


//
//driver.sleep(1000);

// driver.getWindowHandle().then(res => console.log(res));
//driver.switchTo().frame(1);
//driver.findElement(By.id('main')).then(() => console.log('elem found'));
//driver.findElement(By.linkText('q')); //.catch(e => console.log('e', e));
//driver.findElement(By.name('btnG')).click();
//driver.wait(until.titleIs('webdriver - Google Search'), 2000);
//driver.wait(until.titleContains('Яндекс.Новости'), 2000);

//driver.quit().then(() => console.log('ok'));




