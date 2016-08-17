/**
 * Extended webdriver navigation object
 * Extra features:
 * - opening new tab
 *
 * see: selenium-webdriver/lib/webdriver.js Navigation class
 */

const SeleniumNavigation = require('selenium-webdriver/lib/webdriver').Navigation;
const command = require('selenium-webdriver/lib/command');
const extraCommand = require('./commands/extra');

class Navigation extends SeleniumNavigation {
  /**
   * Schedules a command to navigate to a new tab.
   * @param {string} url The URL to navigate to.
   * @return {!promise.Promise<void>} A promise that will be resolved
   *     when the URL has been loaded.
   */
  newTab(url) {
    return this.driver_.schedule(
      new command.Command(extraCommand.NEW_TAB).
      setParameter('url', url),
      'WebDriver.navigate().newTab(' + url + ')');
  }
}

module.exports = Navigation;
