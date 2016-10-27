/**
 * Default values for state fields
 */

const {FILES_SOURCE_TYPE, TAB} = require('./constants');

exports.innerFile = {
  path: 'google_search',
  code: require('raw!../../../examples/google_search'),
};

exports.project = {
  id: 'default',
  filesSource: {
    // for dev builds make default tests source - built-in
    type: buildInfo.isDev ? FILES_SOURCE_TYPE.BUILT_IN : FILES_SOURCE_TYPE.INNER,
    url: 'https://raw.githubusercontent.com/vitalets/autotester/master/examples/index.js',
    path: 'tests/index.js',
  },
  innerFiles: [
    {path: exports.innerFile.path}
  ],
  selectedFile: {
    [FILES_SOURCE_TYPE.INNER]: '',
    [FILES_SOURCE_TYPE.URL]: '',
    [FILES_SOURCE_TYPE.BUILT_IN]: '',
  },
};

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
    id: 'loopback-1',
    hubId: 'loopback',
    name: 'This chrome'
  },
];

exports.selectedTab = TAB.TESTS;
