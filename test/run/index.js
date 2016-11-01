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
const DEV_MODE = false;

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
    driver = buildDriver(caps, resolve, reject);
    openUiAndRun(driver, signature);
    waitForDone(driver, signature);
    Promise.all([
      getStats(driver),
      getErrors(driver),
      getConsole(driver),
    ]).then(([
      stats,
      errorsReport,
      consoleReport
    ]) => {
      const hasErrors = stats.failures !== '0';
      console.log(`${signature}done: ${JSON.stringify(stats, false, 2)}`);
      console.log(`${signature}console: ${consoleReport || 'empty'}`);
      if (hasErrors) {
        console.log(`${signature}errors:\n\n${errorsReport}\n\n`);
      }
      trySendSessionStatus(driver, signature, hasErrors);

      const quit = DEV_MODE ? Promise.resolve() : driver.quit();
      quit.then(
          () => !hasErrors ? resolve() : reject(new Error(`Tests failed`)),
          reject
        );
    }, reject)
  })
  // catch error and resolve with it to not stop Promise.all chain
  .catch(e => fail(driver, signature, e));
}

function buildDriver(caps, resolve, reject) {
  const flow = new webdriver.promise.ControlFlow()
    .on('uncaughtException', reject);

  const builder = new webdriver.Builder();
  if (hub.serverUrl) {
    builder.usingServer(hub.serverUrl);
  }

  return builder
    .withCapabilities(caps)
    .setControlFlow(flow)
    .build();
}

function openUiAndRun(driver, signature) {
  driver.get(AUTOTESTER_UI_URL);
  driver.executeScript(() => navigator.userAgent + ' ' + navigator.language)
    .then(res => console.log(`${signature}${res}`));
  driver.wait(webdriver.until.titleContains('ready'));
  driver.findElement({id: 'run'}).click();
}

function waitForDone(driver, signature) {
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
}

function getStats(driver) {
  const failures = driver.findElement({css: '#mocha-stats .failures em'}).getText();
  const passes = driver.findElement({css: '#mocha-stats .passes em'}).getText();
  const duration = driver.findElement({css: '#mocha-stats .duration em'}).getText();
  return Promise.all([
    failures,
    passes,
    duration
  ]).then(res => {
    return {
      failures: res[0],
      passes: res[1],
      duration: res[2],
    };
  })
}

function getErrors(driver) {
  return driver.findElements({css: '#mocha .test.fail'})
    .then(elems => {
      const tasks = elems.map(elem => elem.getAttribute('innerHTML'));
      return Promise.all(tasks);
    })
    .then(htmls => {
      return htmls.map(html => htmlToText.fromString(html, {ignoreHref: true})).join('\n\n')
    })
}

function getConsole(driver) {
  return driver.findElements({css: '.console'})
    .then(elems => elems.length ? elems[0].getText() : '');
}

// function processReport(html) {
//   const text = htmlToText.fromString(html, {ignoreHref: true}).substr(1);
//   const matches = text.match(/\* duration:.+s/);
//   if (!matches) {
//     console.log('Empty report!');
//     return true;
//   }
//   const headerEnd = matches.index + matches[0].length + 1;
//   const header = text.substr(0, headerEnd);
//   const hasErrors = header.indexOf('failures: 0') === -1;
//   if (hasErrors) {
//     console.log(text);
//   }
//   console.log(header);
//   return hasErrors;
// }

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
  // todo: driver.quit().catch() ?
  // better to show message first as stack is too big
  console.log(`${signature}ERROR: ${e.message || e.stack}`);
  return new Promise(resolve => {
    const p = !DEV_MODE && driver.getSession() ? driver.quit() : Promise.resolve();
    p.then(() => resolve(e), resolve);
  })
}

function throwAsync(e) {
  setTimeout(() => {
    throw e;
  }, 0);
}
