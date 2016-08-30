/**
 * Capabilities for local and remote
 */

'use strict';

const chrome = require('selenium-webdriver/chrome');
const Symbols = require('selenium-webdriver/lib/symbols');

exports.local = function () {
  const caps = defaults();
  caps.chromeOptions.args.push(
    `--load-extension=${__dirname}/../../dist/unpacked-dev,${__dirname}/../data/simple-extension`
  );
  return Promise.resolve(caps);
};

exports.remote = function () {
  const caps = defaults();
  const options = new chrome.Options();
  options.addExtensions(`${__dirname}/../../dist/autotester-dev.crx`);
  options.addExtensions(`${__dirname}/../../dist/simple-extension.crx`);
  const tasks = options[Symbols.serialize]().extensions;
  return Promise.all(tasks)
    .then(extensions => {
      caps.chromeOptions.extensions = extensions;
      return caps;
    });
};

function defaults() {
  return {
    'chromeOptions': {
      'args': [
        '--extensions-on-chrome-urls',
        '--silent-debugger-extension-api',
      ],
    },
    'browserName' : 'chrome',
    'resolution' : '1024x768',
  };
}
