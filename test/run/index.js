/**
 * Entry point for running self-test on different providers
 */

'use strict';

const webdriver = require('selenium-webdriver');
const htmlToText = require('html-to-text');
const providers = require('./providers');

const AUTOTESTER_UI_URL = 'chrome-extension://cidkhbpkgpdkadkjpkfooofilpmfneog/core/ui/ui.html';
const providerName = process.argv[2];
const provider = providers[providerName];

if (!provider) {
  throw new Error(`Provider ${providerName} not found`);
} else {
  console.log(`Running self-tests on '${providerName}'...`);
}

Promise.resolve()
  .then(() => provider.capabilities())
  .then(caps => {
    const builder = new webdriver.Builder();
    if (provider.serverUrl) {
      builder.usingServer(provider.serverUrl);
    }
    const driver = builder
      .withCapabilities(caps)
      .build();

    console.log('driver created');

    driver.get(AUTOTESTER_UI_URL);
    driver.findElement({id: 'run'}).click();
    driver.wait(webdriver.until.titleContains('done'));
    driver.findElement({id: 'mocha'}).getAttribute('innerHTML')
      .then(html => {
        const hasErrors = processReport(html);
        if (provider.sendSessionStatus) {
          driver.call(() => {
            return driver.session_
              .then(session => provider.sendSessionStatus(session.id_, hasErrors));
          });
        }
        driver.quit()
          .then(() => process.exit(hasErrors ? 1 : 0));
      });
  })
  .catch(e => {
    setTimeout(() => {
      throw e;
    }, 0);
  });

function processReport(html) {
  const text = htmlToText.fromString(html, {ignoreHref: true});
  const header = text.substr(0, text.indexOf('* [CHROME]'));
  const hasErrors = header.indexOf('failures: 0') === -1;
  console.log(text);
  console.log(header);
  return hasErrors;
}
