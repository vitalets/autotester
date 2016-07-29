
test.describe('Google Search', function() {

  test.before(function() {
    driver.get('http://www.google.com/ncr');
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

//const Debugger = require('./debugger');
//document.addEventListener('keydown', e => console.log('keydown', e));
//document.addEventListener('keypress', e => console.log('keypress', e));
//document.addEventListener('keyup', e => console.log('keyup', e));

//function simulateKeyEvent(character) {
//  var evt = document.createEvent("KeyboardEvent");
//  //evt.initKeyboardEvent("keypress", true, true, window, 0, 0, 0, 0, 0, character.charCodeAt(0))
//  //evt.initKeyboardEvent("keypress", true, true, window, character);
//  evt.initKeyboardEvent("keypress", true, true, document.defaultView, false, false, false, false, 81, 81);
//  document.dispatchEvent(evt);
//}
//
//simulateKeyEvent('й')


//const d = new Debugger();
//const code = 81;
//d.attach({extensionId: chrome.runtime.id})
//.then(() => d.sendCommand('Input.dispatchKeyEvent', {
//  "modifiers": 0,
// // "nativeVirtualKeyCode": code,
//  "text": "й",
//  // "type": "rawKeyDown",
//  "type": "keyDown",
//  "unmodifiedText": "й",
// // "windowsVirtualKeyCode": code
//}))

//.then(() => d.sendCommand('Input.dispatchKeyEvent', {
//  "modifiers": 0,
//  "nativeVirtualKeyCode": code,
// // "text": "Й",
//  "type": "char",
//   //"unmodifiedText": "й",
//  "windowsVirtualKeyCode": code
//}))
//.then(() => d.sendCommand('Input.dispatchKeyEvent', {
//  "modifiers": 0,
//  "nativeVirtualKeyCode": code,
//  "text": "",
//  "type": "keyUp",
//  "unmodifiedText": "",
//  "windowsVirtualKeyCode": code
//}))

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
