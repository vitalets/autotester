/**
 * Entry point for running self-test on different providers
 */

'use strict';

const webdriver = require('selenium-webdriver');
const htmlToText = require('html-to-text');
const providers = require('./providers');
const capabilities = require('./capabilities');

const AUTOTESTER_UI_URL = 'chrome-extension://cidkhbpkgpdkadkjpkfooofilpmfneog/core/ui/ui.html';

// run tests in all capabilities combination
run();

function run() {
  const provider = getProvider();
  provider.capabilities()
    .then(caps => {
      const capsArray = Array.isArray(caps) ? caps : [caps];
      const tasks = capsArray.map(caps => runForCapabilities(provider, caps));
      Promise.all(tasks)
        .then(res => {
          const errors = res.filter(r => r instanceof Error);
          errors.forEach(e => console.log(`ERROR: ${e.message}`));
          console.log(`FINISHED SESSIONS: ${res.length} (${provider.name})`);
          console.log(`ERRORS: ${errors.length}`);
          process.exit(errors.length ? 1 : 0);
        });
    })
    .catch(throwAsync);
}

function runForCapabilities(provider, caps) {
  const signature = `[${provider.name.toUpperCase()} ${capabilities.signature(caps)}]: `;
  console.log(`${signature}running...`);
  return new Promise((resolve, reject) => {
    const flow = new webdriver.promise.ControlFlow()
      .on('uncaughtException', reject);

    const builder = new webdriver.Builder();
    if (provider.serverUrl) {
      builder.usingServer(provider.serverUrl);
    }
    const driver = builder
      .withCapabilities(caps)
      .setControlFlow(flow)
      .build();

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
          .then(() => !hasErrors ? resolve() : reject(new Error(`Tests failed`)));
      });
  })
  // catch error and resolve with it to not stop Promise.all chain
  .catch(e => {
    e.message = signature + e.message;
    return e;
  });
}

function getProvider() {
  const providerName = process.argv[2];
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`Provider ${providerName} not found`);
  } else {
    provider.name = providerName;
    return provider;
  }
}

function processReport(html) {
  const text = htmlToText.fromString(html, {ignoreHref: true}).substr(1);
  const matches = text.match(/\* duration:.+s/);
  const headerEnd = matches.index + matches[0].length + 1;
  const header = text.substr(0, headerEnd);
  const hasErrors = header.indexOf('failures: 0') === -1;
  console.log(text);
  console.log(header);
  return hasErrors;
}

function throwAsync(e) {
  setTimeout(() => {
    throw e;
  }, 0);
}
