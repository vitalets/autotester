/**
 * Store some predefined data in first run
 * To clear storage run from console: chrome.storage.local.clear()
 */

const thenChrome = require('then-chrome');
const logger = require('../../utils/logger').create('Predefined data');

exports.storeOnFirstRun = function() {
  return isFirstRun()
    .then(firstRun => firstRun ? writeToStorage() : null);
};

function isFirstRun() {
  return thenChrome.storage.local.get('hubs')
    .then(data => Object.keys(data).length === 0);
}

function writeToStorage() {
  const data = {
    hubs,
    targets,
    snippets,
  };
  logger.log('Storing predefined data', data);
  return thenChrome.storage.local.set(data);
}

const hubs = [
  {
    id: 'loopback',
    serverUrl: 'http://autotester',
    loopback: true,
    caps: {
      'browserName': 'chrome'
    }
  },
  {
    id: 'localhost',
    serverUrl: 'http://localhost:4444/wd/hub',
    caps: {
      'browserName': 'chrome'
    }
  },
  // {
  //   id: 'yandex',
  //   serverUrl: 'http://selenium:selenium@sg.yandex-team.ru:4444/wd/hub',
  //   caps: {
  //     'browserName': 'chrome'
  //   }
  // },
  {
    id: 'sauce',
    serverUrl: `http://${__buildInfo.sauceUser}:${__buildInfo.sauceKey}@ondemand.saucelabs.com:80/wd/hub`,
    watchUrl: `https://saucelabs.com/beta/tests/:sessionId/watch`,
    caps: {
      // temp for demo
      'username': window.__buildInfo.sauceUser,
      'accessKey': window.__buildInfo.sauceKey,
      'browserName': 'chrome'
    }
  },
];

const targets = [
  {
    hubId: 'loopback',
    name: 'This chrome'
  },
  /*
   {
   hubId: 'yandex',
   name: 'Yandex grid (chrome 51, linux)',
   caps: {
   'platform': 'LINUX',
   'version' : '51.0',
   }
   },
   {
   hubId: 'yandex',
   name: 'Yandex grid (chrome 53, win7)',
   caps: {
   'platform': 'WINDOWS',
   'version' : '53.0',
   }
   },
   */
  {
    hubId: 'sauce',
    name: 'Sauce labs (chrome stable, win7)',
    caps: {
      'platform': 'Windows 7',
    }
  },
  {
    hubId: 'sauce',
    name: 'Sauce labs (chrome beta, win7)',
    caps: {
      'platform': 'Windows 7',
      'version': 'beta',
    }
  },
  {
    hubId: 'sauce',
    name: 'Sauce labs (firefox stable, win7)',
    caps: {
      'platform': 'Windows 7',
      'browser': 'firefox',
    }
  },
  {
    hubId: 'localhost',
    name: 'Localhost grid (chrome)',
  },
  {
    hubId: 'localhost',
    name: 'Localhost grid (firefox)',
    caps: {
      'browserName': 'firefox'
    }
  },
];

const snippets = [{
      id: 'snippet1',
      name: 'Google search test',
      code: require('raw!../../../examples/google_search_simple'),
}];


