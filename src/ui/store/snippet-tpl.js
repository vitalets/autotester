test.describe('{name}', function () {
  let driver;

  test.before(function () {
    driver = new Driver();
  });

  test.after(function () {
    driver.quit();
  });

  test.it('should pass', function () {
    driver.get('https://google.com');
    driver.wait(until.titleContains('Google'), 2000);
  });

});
