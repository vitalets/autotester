/**
 * This is index file loaded by autotester
 * Make sure to start selenium fileserver to serve static html pages
 * ```
 * npm run fileserver
 * ```
 *
 * This file is also used by ./run-node-test to get actual tests.
 */

module.exports = {
  setup: [
    'setup.js',
  ],
  tests: [
    'playground.js',
    // === specs for autotester extra features (not supported by selenium)
    'specs-extra/newtab_switching_test.js',
    'specs-extra/extension_switching_test.js',
    'specs-extra/collect_network_requests_test.js',
    // === specs to be contributed to selenium
    'specs-selenium-contrib/form_handling_test.js',
    'specs-selenium-contrib/execute_async_script_test.js',
    'specs-selenium-contrib/window_switching_test.js',
    // === specs copied from existing selenium tests in 'node_modules/selenium-webdriver/test'
    'specs-selenium/tag_name_test.js',
    //'specs-selenium/actions_test.js',
    'specs-selenium/execute_script_test.js',
    //'specs-selenium/element_finding_test.js',
  ]
};
