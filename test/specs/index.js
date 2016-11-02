/**
 * Tests configuration and paths
 */

module.exports = {
  setup: [
    'page-object.js',
    'setup.js',
    'helpers.js',
  ],
  tests: [
    // === extra autotester features
    'extras/newtab_switching_test.js',
    'extras/extension_switching_test.js',
    'extras/collect_network_requests_test.js',
    // === ui ===
    'ui/show_errors_test.js',
    'ui/show_success_test.js',
    'ui/examples_test.js',
    'ui/inner_files.js',
    // === specs to be contributed to selenium
    'selenium-contrib/form_handling_test.js',
    'selenium-contrib/execute_async_script_test.js',
    'selenium-contrib/window_switching_test.js',
    'selenium-contrib/alerts_test.js',
    'selenium-contrib/element_attribute_test.js',
    // === specs copied from existing selenium tests in 'node_modules/selenium-webdriver/test'
    'selenium/tag_name_test.js',
    //'specs-selenium/actions_test.js',
    'selenium/execute_script_test.js',
    //'specs-selenium/element_finding_test.js',
  ]
};
