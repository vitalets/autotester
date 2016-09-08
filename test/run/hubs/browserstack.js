/**
 * Browserstack
 */

'use strict';

const got = require('got');
const capabilities = require('../capabilities');

const targets = [
  {
    'os': 'Windows',
    'os_version': '7',
  },
  // {
  //   'os': 'Windows',
  //   'os_version': '10',
  // },
  {
    'os': 'OS X',
    'os_version': 'El Capitan',
  },
];

exports.name = 'browserstack';
exports.serverUrl = `http://hub-cloud.browserstack.com/wd/hub`;
exports.capabilities = function () {
  return capabilities.get()
    .then(caps => {
      return targets.map(target => {
        return Object.assign({}, caps, target, {
          'browserstack.user': process.env.BROWSERSTACK_USER,
          'browserstack.key': process.env.BROWSERSTACK_KEY,
        });
      });
    });
};

// see: https://www.browserstack.com/automate/node
exports.sendSessionStatus = function (sessionId, hasErrors) {
  const status = hasErrors ? 'error' : 'completed';
  const url = `https://www.browserstack.com/automate/sessions/${sessionId}.json`;
  const params = {
    method: 'PUT',
    auth: `${process.env.BROWSERSTACK_USER}:${process.env.BROWSERSTACK_KEY}`,
    body: {
      status: status,
      reason: ''
    }
  };
  return got(url, params);
};
