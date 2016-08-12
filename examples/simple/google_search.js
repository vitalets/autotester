/**
 * Simple scenario to be executed with Autotester
 * There are some globals available for conveniency:
 * - Driver
 * - By
 * - until
 * - report (!)
 * - ...
 */

const driver = new Driver();
driver.get('http://www.google.com/ncr');
driver.findElement(By.name('q')).sendKeys('autotester');
driver.findElement(By.name('btnG')).click();
driver.wait(until.titleIs('autotester - Google Search'), 1000);
driver.quit();
