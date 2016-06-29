window.autotesterConfig = {
  runner: 'mocha',
  assertion: 'chai',
  setup: [

  ],
  tests: [
    'sample.test.js',
    'sample1.test.js',
    'sample2.test.js',
    {
      label: 'Генератор истории',
      tests: [

      ]
    }
  ]
};
