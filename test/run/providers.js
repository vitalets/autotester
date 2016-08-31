/**
 * Configuration of selenium grid providers
 */

'use strict';

const rp = require('request-promise-native');
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
              'browserstack.debug': true,
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
  const credentials = `${process.env.BROWSERSTACK_USER}:${process.env.BROWSERSTACK_KEY}`;
  const uri = `https://${credentials}@www.browserstack.com/automate/sessions/${sessionId}.json`;
  const params = {
    uri: uri,
    method: 'PUT',
    form: {
      status: status,
      reason: ''
    }
  };
  return rp(params);
}
