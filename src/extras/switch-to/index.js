/**
 * Switch to newtab and extension background
 */

const TargetLocator = require('selenium-webdriver/lib/webdriver').TargetLocator;
const command = require('selenium-webdriver/lib/command');
const engines = require('../../engines');

const commands = {
  SWITCH_TO_NEW_TAB: 'SWITCH_TO_NEW_TAB',
  SWITCH_TO_EXTENSION: 'SWITCH_TO_EXTENSION',
};

/**
 * Setup
 * Should be called once
 */
exports.setup = function () {
  registerCommands();
  addNewtabMethod();
  addExtensionMethod();
};

function registerCommands() {
  engines.selenium.registerCommand(commands.SWITCH_TO_NEW_TAB, 'POST', '/session/:sessionId/autotester/newtab');
  engines.selenium.registerCommand(commands.SWITCH_TO_EXTENSION, 'POST', '/session/:sessionId/autotester/extension');
}

function addNewtabMethod() {
  /**
   * Schedules a command to switch the focus of all future commands to new tab.
   * @param {string} url The URL of new tab.
   * @return {!promise.Promise<void>} A promise that will be resolved when the driver has changed focus to the new tab.
   */
  TargetLocator.prototype.newTab = function (url) {
    const cmd = new command.Command(commands.SWITCH_TO_NEW_TAB).setParameter('url', url);
    return this.driver_.schedule(cmd, 'WebDriver.switchTo().newTab(' + url + ')');
  };
}

function addExtensionMethod() {
  /**
   * Schedules a command to switch the focus of all future commands to extension background page.
   * @param {string} [id] extension id. If empty - first available extension will be used
   * @return {!promise.Promise<void>} A promise that will be resolved when the driver has changed focus to the new tab.
   */
  TargetLocator.prototype.extension = function (id) {
    const cmd = new command.Command(commands.SWITCH_TO_EXTENSION).setParameter('id', id);
    return this.driver_.schedule(cmd, 'WebDriver.switchTo().extension(' + id + ')');
  };
}
