/**
 * Network requests collector
 */

const WebDriver = require('selenium-webdriver').WebDriver;
const engines = require('../../engines');
const Collector = require('./collector');
const commands = require('./commands');

/**
 * Setup
 * Should be called once
 */
exports.setup = function () {
  registerCommands();
  addRequestsMethod();
};

/**
 * Use PUT & POST here as we may need to pass filter in body
 */
function registerCommands() {
  engines.selenium.registerCommand(commands.REQUESTS_COLLECT, 'PUT', '/session/:sessionId/autotester/requests');
  engines.selenium.registerCommand(commands.REQUESTS_STOP, 'DELETE', '/session/:sessionId/autotester/requests');
  engines.selenium.registerCommand(commands.REQUESTS_GET, 'POST', '/session/:sessionId/autotester/requests');
}

function addRequestsMethod() {
  WebDriver.prototype.requests = function () {
    if (!this.collector_) {
      this.collector_ = new Collector(this);
    }
    return this.collector_;
  };
}

