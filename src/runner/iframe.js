/**
 * Code injected into sandbox iframe
 */

window.nodeAssert = require('assert');
window.seleniumAssert = require('selenium-webdriver/testing/assert');

window.require.register('selenium-webdriver/testing/assert', seleniumAssert);
window.require.register('assert', nodeAssert);
