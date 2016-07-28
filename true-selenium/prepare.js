'use strict';

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const test = require('selenium-webdriver/testing');

global.test = test;
global.By = webdriver.By;
global.Key = webdriver.Key;
global.until = webdriver.until;

test.before(function () {
  // use chromedriver with full logging
  const service = new chrome.ServiceBuilder('/Users/vitalets/projects/chromium/src/out/Default/chromedriver')
    .usingPort(9515)
    .loggingTo('./log.txt')
    .enableVerboseLogging()
    .build();

  chrome.setDefaultService(service);

  const options = new chrome.Options();
  options.addExtensions('../visbookmarks-chrome/out/yandex.crx');

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

  const driver = new webdriver.Builder()
    .forBrowser('chrome')
    // dont use capabilities here as they are overwritten by setChromeOptions
    .setChromeOptions(options)
    .build();

  // export driver to all tests
  global.driver = driver;
});
