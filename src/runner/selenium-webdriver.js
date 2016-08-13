/**
 * Export own selenium classes as well as selenium-webdriver does
 * See: selenium-webdriver/index.js
 * Exclude `Builder` as it is for all browsers and needs nodejs env.
 */

'use strict';

const Builder = require('../driver/builder');
const actions = require('selenium-webdriver/lib/actions');
const by = require('selenium-webdriver/lib/by');
const capabilities = require('selenium-webdriver/lib/capabilities');
const command = require('selenium-webdriver/lib/command');
const error = require('selenium-webdriver/lib/error');
const events = require('selenium-webdriver/lib/events');
const input = require('selenium-webdriver/lib/input');
const logging = require('selenium-webdriver/lib/logging');
const promise = require('selenium-webdriver/lib/promise');
const session = require('selenium-webdriver/lib/session');
const until = require('selenium-webdriver/lib/until');
const webdriver = require('selenium-webdriver/lib/webdriver');


exports.ActionSequence = actions.ActionSequence;
exports.Browser = capabilities.Browser;
exports.Builder = Builder;
exports.Button = input.Button;
exports.By = by.By;
exports.Capabilities = capabilities.Capabilities;
exports.Capability = capabilities.Capability;
exports.EventEmitter = events.EventEmitter;
exports.FileDetector = input.FileDetector;
exports.Key = input.Key;
exports.Session = session.Session;
exports.WebDriver = webdriver.WebDriver;
exports.WebElement = webdriver.WebElement;
exports.WebElementPromise = webdriver.WebElementPromise;
exports.error = error;
exports.logging = logging;
exports.promise = promise;
exports.until = until;
