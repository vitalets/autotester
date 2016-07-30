
test.describe('VB settings', function() {

  test.before(function() {
    driver.get('chrome://newtab');
    driver.wait(until.elementLocated({css: '.i-action__settings'}), 2000);
  });

  test.it('should open by click', function() {
    const settings = driver.findElement({css: '.settings'});
    settings.getTagName();
    //assert.eventually.equal(settings.isDisplayed(), false);
    //driver.findElement({css: '.i-action__settings'}).click();
    //driver.sleep(1000);
    //driver.wait(until.elementIsVisible(settings), 1000);
  });

  test.after(function() {
    driver.quit();
  });

});
