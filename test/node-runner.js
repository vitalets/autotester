'use strict';

const path = require('path');
const Mocha = require('mocha');
const chrome = require('selenium-webdriver/chrome');
const testConfig = require('./index');

const mocha = new Mocha({
  ui: 'bdd',
  timeout: 60 * 1000,
});

setupChromedriver();

testConfig.tests.forEach(test => {
  test = test.replace('specs/', './test/specs/');
  test = test.replace('specs-selenium/', './node_modules/selenium-webdriver/test/');
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
