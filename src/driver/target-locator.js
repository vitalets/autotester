/**
 * Extended webdriver TargetLocator
 * Extra features:
 * - opening new tab
 *
 * see: selenium-webdriver/lib/webdriver.js TargetLocator class
 */

const SeleniumTargetLocator = require('selenium-webdriver/lib/webdriver').TargetLocator;
const command = require('selenium-webdriver/lib/command');
const extraCommand = require('./commands/extra');

class TargetLocator extends SeleniumTargetLocator {
  /**
   * Schedules a command to switch the focus of all future commands to new tab.
   * @param {string} url The URL of new tab.
   * @return {!promise.Promise<void>} A promise that will be resolved
   *     when the driver has changed focus to the new tab.
   */
  newTab(url) {
    const cmd = new command.Command(extraCommand.SWITCH_TO_NEW_TAB).setParameter('url', url);
    return this.driver_.schedule(cmd, 'WebDriver.switchTo().newTab(' + url + ')');
  }

  /**
   * Schedules a command to switch the focus of all future commands to extension background page.
   * @param {string} [id] extension id. If empty - first available extension will be used
   * @return {!promise.Promise<void>} A promise that will be resolved
   *     when the driver has changed focus to the new tab.
   */
  extension(id) {
    const cmd = new command.Command(extraCommand.SWITCH_TO_EXTENSION).setParameter('id', id);
    return this.driver_.schedule(cmd, 'WebDriver.switchTo().extension(' + id + ')');
  }
}

module.exports = TargetLocator;
