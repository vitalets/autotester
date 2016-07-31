/**
 * This is index file loaded by autotester
 * But also used by node-runner to get actual specs
 */

module.exports = {
  prepare: [

  ],
  tests: [
    //'/test/google-search.test.js',
    'specs/vb-settings.test.js',
    // === own selenium specs from 'node_modules/selenium-webdriver/test' ===
    'specs-selenium/tag_name_test.js',
    // 'specs-selenium/element_finding_test.js',
  ]
};
