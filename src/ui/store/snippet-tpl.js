test.describe('{name}', function() {

  test.it('should pass', function() {
    var driver = new Driver();
    driver.get('https://google.com');
    driver.wait(until.titleContains('Google'), 2000);
    driver.quit();
  });

});
