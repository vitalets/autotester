/**
 * Entry point for running self-test on different selenium hubs
 *
 * This code runs chrome with 2 extensions:
 * 1. autotester-dev
 * (dist/autotester-dev.crx, packed with all tests from `test/specs` dir)
 *
 * 2. SELF TEST autotester
 * (dist/autotester.crx, packed with tests from `examples` dir and one pre-installed snippet)
 *
 * First extension runs tests over second.
 * So from here we press RUN button in `Autotester` UI and it starts testing `SELF TEST Autotester`.
 *
 * We are waiting for `done` in title and grab data from mocha report.
 */

'use strict';

const webdriver = require('selenium-webdriver');
const htmlToText = require('html-to-text');
const capabilities = require('./capabilities');
// try load env vars
try {
  const env = require('../../env');
  Object.assign(process.env, env);
} catch (e) {}
const hub = require('./hubs/' + process.argv[2]);

const AUTOTESTER_UI_URL = 'chrome-extension://inilfehdbldcjcffbakeabignfomfbdh/core/ui/ui.html';

// run tests in all capabilities combination
run();

function run() {
  hub.capabilities()
    .then(caps => {
      const capsArray = Array.isArray(caps) ? caps : [caps];
      const tasks = capsArray.map(caps => runForCapabilities(caps));
      Promise.all(tasks)
        .then(res => {
          const errors = res.filter(r => r instanceof Error);
          console.log(`FINISHED SESSIONS: ${res.length} (${hub.name})`);
          console.log(`ERRORS: ${errors.length}`);
          process.exit(errors.length ? 1 : 0);
        });
    })
    .catch(throwAsync);
}

// todo: add timeout (check if title not changed for some time)?
function runForCapabilities(caps) {
  const signature = `[${hub.name.toUpperCase()} ${capabilities.signature(caps)}]: `;
  console.log(`${signature}running...`);
  let driver;
  return new Promise((resolve, reject) => {
    const flow = new webdriver.promise.ControlFlow()
      .on('uncaughtException', reject);

    const builder = new webdriver.Builder();
    if (hub.serverUrl) {
      builder.usingServer(hub.serverUrl);
    }
    driver = builder
      .withCapabilities(caps)
      .setControlFlow(flow)
      .build();

    driver.get(AUTOTESTER_UI_URL);
    driver.executeScript(function() {
      return navigator.userAgent + ' ' + navigator.language;
    }).then(res => console.log(`${signature}${res}`));
    driver.findElement({id: 'run'}).click();
    let prevTitle = '';
    driver.wait(() => {
      return driver.getTitle().then(title =>{
        if (title !== prevTitle) {
          console.log(signature + title);
          prevTitle = title;
        }
        return title.indexOf('done') >= 0;
      })
    });
    // todo: read htmlConsole as there can be errors
    const mochaReport = driver.findElement({id: 'mocha'}).getAttribute('innerHTML');
    const consoleReport = driver.findElements({css: '.console'})
        .then(elems => elems.length ? elems[0].getText() : '');
    Promise.all([mochaReport, consoleReport]).then(([mochaReport, consoleReport]) => {
      console.log(`${signature}console: ${consoleReport}`);
      console.log(`${signature}mocha report: `);
      const hasErrors = processReport(mochaReport, signature);
      trySendSessionStatus(driver, signature, hasErrors);
      driver.quit()
        .then(
          () => !hasErrors ? resolve() : reject(new Error(`Tests failed`)),
          reject
        );
    }, reject)
  })
  // catch error and resolve with it to not stop Promise.all chain
  .catch(e => fail(driver, signature, e));
}

function processReport(html) {
  const text = htmlToText.fromString(html, {ignoreHref: true}).substr(1);
  const matches = text.match(/\* duration:.+s/);
  if (!matches) {
    console.log('Empty report!');
    return true;
  }
  const headerEnd = matches.index + matches[0].length + 1;
  const header = text.substr(0, headerEnd);
  const hasErrors = header.indexOf('failures: 0') === -1;
  if (hasErrors) {
    console.log(text);
  }
  console.log(header);
  return hasErrors;
}

function trySendSessionStatus(driver, signature, hasErrors) {
  if (hub.sendSessionStatus) {
    driver.call(() => {
      return driver.session_
        .then(session => hub.sendSessionStatus(session.id_, hasErrors))
        .then(() => console.log(`${signature}session status sent as: ${hasErrors ? 'failed' : 'success'}`))
        .catch(e => console.log(`${signature}session status sending error`, e));
    });
  }
}

function fail(driver, signature, e) {
  if (driver.getSession()) {
    driver.quit();
  }
  // todo: driver.quit().catch() ?
  // better to show message first as stack is too big
  console.log(`${signature}ERROR: ${e.message || e.stack}`);
  return e;
}

function throwAsync(e) {
  setTimeout(() => {
    throw e;
  }, 0);
}
