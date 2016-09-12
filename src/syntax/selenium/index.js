/**
 * Webdriver implementation that uses chrome.debugger.* api
 */

const WebDriver = require('selenium-webdriver/lib/webdriver').WebDriver;
const Capabilities = require('selenium-webdriver/lib/capabilities').Capabilities;
const Executor = require('./executor');
const Requests = require('./requests');
const TargetLocator = require('./target-locator');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

const service = new chrome.ServiceBuilder()
  .usingPort(9515)
  .build();

chrome.setDefaultService(service);







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
   * @return {!TargetLocator} The target locator interface for this
   *     instance.
   */
  switchTo() {
    return new TargetLocator(this);
  }
}

module.exports = chrome.Driver;

