
test.describe('VB settings', function() {

  test.before(function() {
    driver.get('chrome://newtab');
    driver.wait(until.elementLocated({css: '.i-action__settings'}), 2000);
  });

  test.it('should open by click', function() {
    driver.findElement({css: '.i-action__settings'}).click();
    //driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    driver.sleep(1000);
  });

  test.after(function() {
    driver.quit();
  });

});
