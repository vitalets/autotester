/**
 * Pre-defined data
 */

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
  {
    id: 'yandex',
    serverUrl: 'http://selenium:selenium@sg.yandex-team.ru:4444/wd/hub',
    caps: {
      'browserName': 'chrome'
    }
  },
  {
    id: 'sauce',
    serverUrl: 'http://ondemand.saucelabs.com:80/wd/hub',
    caps: {
      'username': '',
      'accessKey': '',
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
    name: 'Localhost grid (chrome)',
  },
  {
    hubId: 'localhost',
    name: 'Localhost grid (firefox)',
    caps: {
      'browserName': 'firefox'
    }
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
  }
];
