/**
 * Webdriver implementation that uses chrome.debugger.* api
 */

const WebDriver = require('./selenium-webdriver').WebDriver;
const Capabilities = require('./selenium-webdriver').Capabilities;
const Executor = require('./executor');

/**
 * Creates a new WebDriver client for Chrome.
 */
class Driver extends WebDriver {
  constructor() {
    const caps = Capabilities.chrome();
    const executor = new Executor();
    const driver = WebDriver.createSession(executor, caps);
    super(driver.getSession(), executor, driver.controlFlow());
  }
}

module.exports = Driver;


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
