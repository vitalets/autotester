/**
 * Simple scenario to be executed with Autotester
 * There are some globals available for convenience:
 * - Driver
 * - By
 * - until
 * - console
 */

const driver = new Driver();
driver.get('http://www.google.com');
driver.findElement(By.name('q')).sendKeys('webdriver' + Key.ENTER);
driver.wait(until.titleContains('webdriver'), 2000);
driver.getTitle().then(title => {
  console.log('Title is:', title);
});
driver.quit();
