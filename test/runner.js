/**
 * Run self-tests in local chrome or cloud farm.
 * Selenium here is used to open Chrome, navigate to Autotester UI and click on 'Run' button.
 * Autotester is packed with self-tests.
 */

const webdriver = require('selenium-webdriver');
const Symbols = require('selenium-webdriver/lib/symbols');
const chrome = require('selenium-webdriver/chrome');
const htmlToText = require('html-to-text');
const request = require('request');

const isLocal = !process.env.BROWSERSTACK_USER;

Promise.resolve()
  .then(() => isLocal ? getLocalDriver() : getRemoteDriver())
  .then(driver => {
    driver.get('chrome-extension://cidkhbpkgpdkadkjpkfooofilpmfneog/core/ui/ui.html');
    driver.findElement({id: 'run'}).click();
    driver.wait(webdriver.until.titleContains('done'));
    driver.findElement({id: 'mocha'}).getAttribute('innerHTML')
      .then(html => {
        text = htmlToText.fromString(html, {ignoreHref: true});
        const header = text.substr(0, text.indexOf('* [CHROME]'));
        const exitCode = header.indexOf('failures: 0') >= 0 ? 0 : 1;
        console.log(text);
        console.log(header);
        if (!isLocal) {
          setSessionStatus(driver, exitCode);
        }
        driver.quit().then(() => process.exit(exitCode));
      });
  })
  .catch(e => {
    setTimeout(() => {
      throw e;
    }, 0);
  });

function getLocalDriver() {
  const options = new chrome.Options();
  options.addArguments([
    `--load-extension=${__dirname}/../dist/unpacked-dev,${__dirname}/data/simple-extension`,
    `--extensions-on-chrome-urls`,
    `--silent-debugger-extension-api`,
  ]);

  const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  return Promise.resolve(driver);
}

function getRemoteDriver() {
  return getExtensionsForRemote()
    .then(extensions => getCapsForRemote(extensions))
    .then(caps => {
      return new webdriver.Builder()
        .usingServer('http://hub-cloud.browserstack.com/wd/hub')
        .withCapabilities(caps)
        .build();
    });
}

function getExtensionsForRemote() {
  let options = new chrome.Options();
  options.addExtensions(`${__dirname}/../dist/autotester-dev.crx`);
  options.addExtensions(`${__dirname}/../dist/simple-extension.crx`);
  return Promise.all(options[Symbols.serialize]().extensions);
}

function getCapsForRemote(extensions) {
  return {
    'browserstack.user': process.env.BROWSERSTACK_USER,
    'browserstack.key': process.env.BROWSERSTACK_KEY,
    'browserstack.debug': true,
    'chromeOptions': {
    'args': [
      '--extensions-on-chrome-urls',
      '--silent-debugger-extension-api',
    ],
      'extensions': extensions
    },
    'browserName' : 'chrome',
    'os' : 'Windows',
    'os_version' : '7',
    'resolution' : '1024x768',
  };
}

function setSessionStatus(driver, hasErrors) {
  const status = hasErrors ? 'error' : 'completed';
  driver.call(() => {
    return driver.session_
      .then(session => sendSessionStatus(session.id_, status))
  });
}

// see: https://www.browserstack.com/automate/node
function sendSessionStatus(sessionId, status) {
  const credentials = `${process.env.BROWSERSTACK_USER}:${process.env.BROWSERSTACK_KEY}`;
  const uri = `https://${credentials}@www.browserstack.com/automate/sessions/${sessionId}.json`;
  return new Promise((resolve, reject) => {
    request({
      uri: uri,
      method: 'PUT',
      form: {
        status: status,
        reason: ''
      }
    }, err => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(`marked session ${sessionId} as ${status}`);
        resolve();
      }
    })
  });
}
