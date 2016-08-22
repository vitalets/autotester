#!/usr/bin/env node
/**
 * Run tests from ./test/** under native selenium (node)
 * Use custom chromedriver with full logging
 */

'use strict';

const path = require('path');
const Mocha = require('mocha');
const chrome = require('selenium-webdriver/chrome');
const testConfig = require('./test');

const mocha = new Mocha({
  ui: 'bdd',
  timeout: 3 * 1000,
});

setupChromedriver();

// uncomment to run specific test
//testConfig.tests = ['specs/playground.js'];
testConfig.tests = ['specs/form_handling_test.js'];

testConfig.tests.forEach(test => {
  test = path.join('./test', test);
  // for existing selenium tests actually run files from ./node_modules/selenium-webdriver/test/
  test = test.replace('./test/specs-selenium/', './node_modules/selenium-webdriver/test/');
  mocha.addFile(test);
});

process.env['SELENIUM_BROWSER'] = 'chrome';

mocha.run(failures => {
  // console.log('Finish', failures);
  process.on('exit', () => {
    process.exit(failures);
  });
});

function setupChromedriver() {
  // use chromedriver with full logging
  const chromedriverPath = '/Users/vitalets/projects/chromium/src/out/Default/chromedriver';
  const service = new chrome.ServiceBuilder(chromedriverPath)
    .usingPort(9516)
    .loggingTo('./log.txt')
    .enableVerboseLogging()
    .build();

  chrome.setDefaultService(service);
}

//const logging = webdriver.logging;
/*
 const prefs = new logging.Preferences();
 prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
 prefs.setLevel(logging.Type.CLIENT, logging.Level.ALL);
 prefs.setLevel(logging.Type.DRIVER, logging.Level.ALL);
 prefs.setLevel(logging.Type.PERFORMANCE, logging.Level.ALL);
 prefs.setLevel(logging.Type.SERVER, logging.Level.ALL);
 options.setLoggingPrefs(prefs);
 */

//logging.installConsoleHandler();
//logging.getLogger('webdriver').setLevel(logging.Level.FINER);
