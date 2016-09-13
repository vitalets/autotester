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

function registerCommands() {
  engines.selenium.registerCommand(commands.REQUESTS_COLLECT, 'POST', '/session/:sessionId/requests');
  engines.selenium.registerCommand(commands.REQUESTS_STOP, 'DELETE', '/session/:sessionId/requests');
  engines.selenium.registerCommand(commands.REQUESTS_GET, 'GET', '/session/:sessionId/requests');
}

function addRequestsMethod() {
  WebDriver.prototype.requests = function () {
    if (!this.collector_) {
      this.collector_ = new Collector(this);
    }
    return this.collector_;
  };
}

