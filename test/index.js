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
  setup: [
    'setup.js',
  ],
  tests: [
    'specs/playground.js',
    'specs/switch_to_test.js',
    'specs/collect_network_requests_test.js',
    // === own selenium specs from 'node_modules/selenium-webdriver/test' ===
    'specs-selenium/tag_name_test.js',
    //'specs-selenium/actions_test.js',
    'specs-selenium/execute_script_test.js',
    //'specs-selenium/element_finding_test.js',
  ]
};
