
test.describe('display errors', function() {
  var driver;

  test.before(function() {
    driver = new Driver();
    driver.get(runContext.selftest.ui);
  });

  test.it.skip('should show error for incorrect syntax', function() {

  });

  test.after(function() {
    driver.quit();
  });
});
