/**
 * Configuration of selenium grid providers
 */

'use strict';

const got = require('got');
const capabilities = require('./capabilities');

const browserstackTargets = [
  {
    'os': 'Windows',
    'os_version': '7',
  },
  {
    'os' : 'Windows',
    'os_version' : '10',
  },
  {
    'os' : 'OS X',
    'os_version' : 'El Capitan',
  },
];

module.exports = {
  local: {
    capabilities: function () {
      return capabilities.local();
    }
  },
  browserstack: {
    serverUrl: `http://hub-cloud.browserstack.com/wd/hub`,
    capabilities: function () {
      return capabilities.remote()
        .then(caps => {
          return browserstackTargets.map(target => {
            return Object.assign({}, caps, target, {
              'browserstack.user': process.env.BROWSERSTACK_USER,
              'browserstack.key': process.env.BROWSERSTACK_KEY,
            });
          });
        });
    },
    sendSessionStatus: sendBrowserstackSessionStatus
  },
  yandex: {
    serverUrl: `http://selenium:selenium@sg.yandex-team.ru:4444/wd/hub`,
    capabilities: function () {
      return capabilities.remote()
        .then(caps => {
          Object.assign(caps, {
            'version' : '51.0',
          });
          return caps;
        });
    }
  }
};

// see: https://www.browserstack.com/automate/node
function sendBrowserstackSessionStatus(sessionId, hasErrors) {
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
}
