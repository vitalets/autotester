/**
 * Configuration of selenium grid providers
 */

'use strict';

const request = require('request');
const capabilities = require('./capabilities');

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
          Object.assign(caps, {
            'browserstack.user': process.env.BROWSERSTACK_USER,
            'browserstack.key': process.env.BROWSERSTACK_KEY,
            'browserstack.debug': true,
            'os': 'Windows',
            'os_version': '7',
          });
          return caps;
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
  return new Promise((resolve, reject) => {
    request({
      uri: uri,
      method: 'PUT',
      form: {
        status: status,
        reason: ''
      }
    }, err => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(`Mark session ${sessionId} as ${status}`);
        resolve();
      }
    })
  });
}
