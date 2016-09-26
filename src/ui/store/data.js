/**
 * Pre-defined data
 */


exports.snippets = [{
  id: 'snippet1',
  name: 'Google search test',
  code: require('raw!../../../examples/google_search_simple'),
}];

exports.hubs = [
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
];

exports.targets = [
  {
    hubId: 'loopback',
    name: 'This chrome'
  },
  {
    hubId: 'localhost',
    name: 'Localhost server (chrome)',
  },
  {
    hubId: 'localhost',
    name: 'Localhost server (firefox)',
    caps: {
      'browserName': 'firefox'
    }
  }
];

// add yandex hub and targets
if (window.__buildInfo.yandexUser) {
  exports.hubs = exports.hubs.concat([
    {
      id: 'yandex',
      serverUrl: `http://${__buildInfo.yandexUser}:${__buildInfo.yandexKey}@sg.yandex-team.ru:4444/wd/hub`,
      caps: {
        'browserName': 'chrome'
      }
    }
  ]);

  exports.targets = exports.targets.concat([
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
  ]);
}

// add sauce hub and targets
if (window.__buildInfo.sauceUser) {
  exports.hubs = exports.hubs.concat([
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
    }
  ]);

  exports.targets = exports.targets.concat([
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
  ]);
}
