
const webdriver = require('selenium-webdriver/lib/webdriver');

const logging = require('selenium-webdriver/lib/logging');
const capabilities = require('selenium-webdriver/lib/capabilities');

const Executor = require('./executor');

/**
 * Creates a new WebDriver client for Chrome.
 */
class Driver extends webdriver.WebDriver {
  constructor() {
    /*

    const prefs = new logging.Preferences();
    prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
    prefs.setLevel(logging.Type.CLIENT, logging.Level.ALL);
    prefs.setLevel(logging.Type.DRIVER, logging.Level.ALL);
    prefs.setLevel(logging.Type.PERFORMANCE, logging.Level.ALL);
    prefs.setLevel(logging.Type.SERVER, logging.Level.ALL);


    logging.getLogger('').setLevel(logging.Level.FINER);
    logging.getLogger('').addHandler(entry => {
      if (entry.message.indexOf('enqueue') >= 0
        && entry.message.indexOf('<then>') == -1
        && entry.message.indexOf('<catch>') == -1) {
        console.log('[selenium]', entry.message);
      }
    });
    */

    const caps = capabilities.Capabilities.chrome();
    const executor = new Executor();
    const driver = webdriver.WebDriver.createSession(executor, caps);
    super(driver.getSession(), executor, driver.controlFlow());
  }
}

module.exports = Driver;
