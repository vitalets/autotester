/**
 * Extra targets defined by buildInfo.isDev and process.env variables and applied in install controller
 */

exports.hubs = [];
exports.targets = [];

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
      id: 'localhost-1',
      hubId: 'localhost',
      name: 'Localhost server (chrome)',
    },
    {
      id: 'localhost-2',
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
      id: 'yandex-1',
      hubId: 'yandex',
      name: 'Yandex grid (chrome 51, linux)',
      caps: {
        'platform': 'LINUX',
        'version' : '51.0',
      }
    },
    {
      id: 'yandex-2',
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
      id: 'sauce-1',
      hubId: 'sauce',
      name: 'Sauce labs (chrome stable, win7)',
      caps: {
        'platform': 'Windows 7',
      }
    },
    {
      id: 'sauce-2',
      hubId: 'sauce',
      name: 'Sauce labs (chrome beta, win7)',
      caps: {
        'platform': 'Windows 7',
        'version': 'beta',
      }
    },
    {
      id: 'sauce-3',
      hubId: 'sauce',
      name: 'Sauce labs (firefox stable, win7)',
      caps: {
        'platform': 'Windows 7',
        'browserName': 'firefox',
      }
    },
  ]);
}
