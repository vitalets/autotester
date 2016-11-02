/**
 * Saucelabs
 */

'use strict';

const got = require('got');
const capabilities = require('../capabilities');

// configurator: https://wiki.saucelabs.com/display/DOCS/Platform+Configurator?_ga=1.181659495.1907159436.1468141299#/
// chrome dev always fails with chromedriver error
const targets = [
  {
    'platform': 'Windows 7',
    'version': 'latest',
  },
  {
    'platform': 'Windows 7',
    'version': 'beta',
  },
  // {
  //   'platform': 'Windows 10',
  // },
];

exports.name = 'sauce';
exports.serverUrl = `http://ondemand.saucelabs.com:80/wd/hub`;
exports.capabilities = function () {
  return capabilities.get()
    .then(caps => {
      return targets.map(target => {
        return Object.assign({}, caps, target, {
          'username': process.env.SAUCE_USER,
          'accessKey': process.env.SAUCE_KEY,
          'screenResolution': caps.resolution,
          'name': 'Autotester',
        });
      });
    });
};

// see: https://wiki.saucelabs.com/display/DOCS/Annotating+Tests+with+the+Sauce+Labs+REST+API
exports.sendSessionStatus = function (sessionId, hasErrors) {
  const url = `https://saucelabs.com/rest/v1/${process.env.SAUCE_USER}/jobs/${sessionId}`;
  const params = {
    method: 'PUT',
    auth: `${process.env.SAUCE_USER}:${process.env.SAUCE_KEY}`,
    body: JSON.stringify({
      passed: !hasErrors,
      build: process.env.TRAVIS_BUILD_NUMBER || 1,
    })
  };
  return got(url, params);
};
