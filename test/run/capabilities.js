/**
 * Capabilities for local and remote
 */

'use strict';

const chrome = require('selenium-webdriver/chrome');
const Symbols = require('selenium-webdriver/lib/symbols');

exports.get = function () {
  const caps = defaults();
  const options = new chrome.Options();
  options.addExtensions(`${__dirname}/../../dist/autotester-dev.crx`);
  options.addExtensions(`${__dirname}/../../dist/autotester.crx`);
  const tasks = options[Symbols.serialize]().extensions;
  return Promise.all(tasks)
    .then(extensions => {
      caps.chromeOptions.extensions = extensions;
      return caps;
    });
};

exports.signature = function (caps) {
  return [
    caps.browserName,
    caps.version || 'stable',
    caps.os || caps.platform,
    caps.os_version
  ].filter(Boolean).join(' ');
};

function defaults() {
  return {
    'chromeOptions': {
      'args': [
        '--lang=en',
        '--extensions-on-chrome-urls',
        '--silent-debugger-extension-api',
      ],
    },
    'browserName' : 'chrome',
    'resolution' : '1024x768',
  };
}
