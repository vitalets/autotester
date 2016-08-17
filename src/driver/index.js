/**
 * Webdriver implementation that uses chrome.debugger.* api
 */

const WebDriver = require('selenium-webdriver/lib/webdriver').WebDriver;
const Capabilities = require('selenium-webdriver/lib/capabilities').Capabilities;
const Executor = require('./executor');
const Requests = require('./requests');
const Navigation = require('./navigation');

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

  /**
   * Returns instance of network requests catcher.
   * It allows to catch and assert any network requests made from target page.
   * Example:
   *
   *     driver.requests().catch();
   *     driver.get('http://google.com');
   *     driver.requests().stop();
   *     const count = driver.requests().getCount({url: 'http://google.com'});
   *     assert(count).equalTo(1);
   *
   * @return {Requests}
   */
  requests() {
    if (!this.requests_) {
      this.requests_ = new Requests(this);
    }
    return this.requests_;
  }

  /**
   * @return {!Navigation} The navigation interface for this instance.
   */
  navigate() {
    return new Navigation(this);
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
