/**
 * This is index file loaded by autotester
 * Make sure to start selenium fileserver to serve static html pages
 * ```
 * npm run fileserver
 * ```
 *
 * This file is also used by node-runner to get actual tests.
 */

module.exports = {
  prepare: [
    'prepare.js',
  ],
  tests: [
    //'specs/google-search.test.js',
    //'specs/vb-settings.test.js',
    // === own selenium specs from 'node_modules/selenium-webdriver/test' ===
    'specs-selenium/tag_name_test.js',
    //'specs-selenium/element_finding_test.js',
  ]
};
