/**
 * Pre-defined data
 */

const {TESTS_SOURCE_TYPE} = require('./constants');
exports.snippetsCode = {
  'google_search': require('raw!../../../examples/google_search'),
};

exports.projects = [
  {
    id: 'default',
    // for dev builds make default tests source - built-in
    testsSource: {
      type: window.__buildInfo.isDev ? TESTS_SOURCE_TYPE.BUILT_IN : TESTS_SOURCE_TYPE.SNIPPETS,
      url: 'https://raw.githubusercontent.com/vitalets/autotester/master/examples/index.js',
      path: 'tests/index.js',
    },
    snippets: [{filename: 'google_search'}],
    selectedTest: {
      snippetType: '',
      urlType: '',
      builtInType: '',
    },
  }
];

exports.hubs = [
  {
    id: 'loopback',
    serverUrl: 'http://autotester',
    loopback: true,
    caps: {
      'browserName': 'chrome'
    }
  }
];

exports.targets = [
  {
    hubId: 'loopback',
    name: 'This chrome'
  },
];

// add localhost hub and target (currently for dev build only)
if (buildInfo.isDev) {
  exports.hubs = exports.hubs.concat([
    {
      id: 'localhost',
      serverUrl: 'http://localhost:4444/wd/hub',
      caps: {
        'browserName': 'chrome'
      }
    },
  ]);

  exports.targets = exports.targets.concat([
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
  ]);
}

// add yandex hub and targets
if (buildInfo.isDev && process.env.YANDEX_USER) {
  exports.hubs = exports.hubs.concat([
    {
      id: 'yandex',
      serverUrl: `http://${process.env.YANDEX_USER}:${process.env.YANDEX_KEY}@sg.yandex-team.ru:4444/wd/hub`,
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
if (buildInfo.isDev && process.env.SAUCE_USER) {
  exports.hubs = exports.hubs.concat([
    {
      id: 'sauce',
      serverUrl: `http://${process.env.SAUCE_USER}:${process.env.SAUCE_KEY}@ondemand.saucelabs.com:80/wd/hub`,
      watchUrl: `https://saucelabs.com/beta/tests/:sessionId/watch`,
      caps: {
        // temp for demo
        'username': process.env.SAUCE_USER,
        'accessKey': process.env.SAUCE_KEY,
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
        'browserName': 'firefox',
      }
    },
  ]);
}
