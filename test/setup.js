/**
 * Preparation for running own selenium tests in autotester (browser env)
 * see: selenium-webdriver/lib/test/**
 */

const FILE_SERVER_BASE_URL = 'http://127.0.0.1:2310/common/';

setup();

function setup() {
  setupTest();
  setupRequire();
  setupSimpleExtensionParams();
}

function setupTest() {
  test.suite = suite;
  test.Pages = getPages();
  test.whereIs = whereIs;
}

function setupRequire() {
  // selenium tests require webdriver as '..'
  require.alias('..', 'selenium-webdriver');

  require.register('selenium-webdriver/lib/test/fileserver', {
    Pages: test.Pages,
    whereIs: test.whereIs,
  });

  // selenium uses special `test` object to run same tests over several browsers
  require.register('selenium-webdriver/lib/test', test);

  // this is strange unused require in execute_script_test.js
  // fixed in: https://github.com/SeleniumHQ/selenium/pull/2598
  require.register('path', {});
}

function setupSimpleExtensionParams() {
  const id = 'okmmklebfnaockijmhpkoilemnfcbeic';
  runContext.simpleExtension = {
    id: id,
    handle: `extension-${id}`,
    bg: `chrome-extension://${id}/_generated_background_page.html`,
    popup: `chrome-extension://${id}/popup.html`,
  };
}

function suite(fn, opt_options) {
  const browser = 'chrome';
  test.describe('[' + browser + ']', function() {
    fn(new TestEnvironment(browser));
  });
}

function TestEnvironment(browserName, server) {
  this.currentBrowser = function() {
    return browserName;
  };

  this.isRemote = function() {
    return false;
  };

  this.browsers = function(var_args) {
    var browsersToIgnore = Array.prototype.slice.apply(arguments, [0]);
    return browsers(browserName, browsersToIgnore);
  };

  this.builder = function() {
    const webdriver = require('selenium-webdriver');
    return new webdriver.Builder();
  };
}

/**
 * Creates a predicate function that ignores tests for specific browsers.
 * @param {string} currentBrowser The name of the current browser.
 * @param {!Array.<!Browser>} browsersToIgnore The browsers to ignore.
 * @return {function(): boolean} The predicate function.
 */
function browsers(currentBrowser, browsersToIgnore) {
  return function() {
    return browsersToIgnore.indexOf(currentBrowser) != -1;
  };
}

function whereIs(filePath) {
  filePath = filePath
    .replace(/\\/g, '/')
    .replace(/^\//, '');
  return FILE_SERVER_BASE_URL + filePath;
}

function getPages() {
  return (function() {
    var pages = {};
    function addPage(page, path) {
      pages.__defineGetter__(page, function() {
        return whereIs(path);
      });
    }

    addPage('ajaxyPage', 'ajaxy_page.html');
    addPage('alertsPage', 'alerts.html');
    addPage('bodyTypingPage', 'bodyTypingTest.html');
    addPage('booleanAttributes', 'booleanAttributes.html');
    addPage('childPage', 'child/childPage.html');
    addPage('chinesePage', 'cn-test.html');
    addPage('clickJacker', 'click_jacker.html');
    addPage('clickEventPage', 'clickEventPage.html');
    addPage('clicksPage', 'clicks.html');
    addPage('colorPage', 'colorPage.html');
    addPage('deletingFrame', 'deletingFrame.htm');
    addPage('draggableLists', 'draggableLists.html');
    addPage('dragAndDropPage', 'dragAndDropTest.html');
    addPage('droppableItems', 'droppableItems.html');
    addPage('documentWrite', 'document_write_in_onload.html');
    addPage('dynamicallyModifiedPage', 'dynamicallyModifiedPage.html');
    addPage('dynamicPage', 'dynamic.html');
    addPage('echoPage', 'echo');
    addPage('errorsPage', 'errors.html');
    addPage('xhtmlFormPage', 'xhtmlFormPage.xhtml');
    addPage('formPage', 'formPage.html');
    addPage('formSelectionPage', 'formSelectionPage.html');
    addPage('framesetPage', 'frameset.html');
    addPage('grandchildPage', 'child/grandchild/grandchildPage.html');
    addPage('html5Page', 'html5Page.html');
    addPage('html5OfflinePage', 'html5/offline.html');
    addPage('iframePage', 'iframes.html');
    addPage('javascriptEnhancedForm', 'javascriptEnhancedForm.html');
    addPage('javascriptPage', 'javascriptPage.html');
    addPage('linkedImage', 'linked_image.html');
    addPage('longContentPage', 'longContentPage.html');
    addPage('macbethPage', 'macbeth.html');
    addPage('mapVisibilityPage', 'map_visibility.html');
    addPage('metaRedirectPage', 'meta-redirect.html');
    addPage('missedJsReferencePage', 'missedJsReference.html');
    addPage('mouseTrackerPage', 'mousePositionTracker.html');
    addPage('nestedPage', 'nestedElements.html');
    addPage('readOnlyPage', 'readOnlyPage.html');
    addPage('rectanglesPage', 'rectangles.html');
    addPage('redirectPage', 'redirect');
    addPage('resultPage', 'resultPage.html');
    addPage('richTextPage', 'rich_text.html');
    addPage('selectableItemsPage', 'selectableItems.html');
    addPage('selectPage', 'selectPage.html');
    addPage('simpleTestPage', 'simpleTest.html');
    addPage('simpleXmlDocument', 'simple.xml');
    addPage('sleepingPage', 'sleep');
    addPage('slowIframes', 'slow_loading_iframes.html');
    addPage('slowLoadingAlertPage', 'slowLoadingAlert.html');
    addPage('svgPage', 'svgPiechart.xhtml');
    addPage('tables', 'tables.html');
    addPage('underscorePage', 'underscore.html');
    addPage('unicodeLtrPage', 'utf8/unicode_ltr.html');
    addPage('uploadPage', 'upload.html');
    addPage('veryLargeCanvas', 'veryLargeCanvas.html');
    addPage('xhtmlTestPage', 'xhtmlTest.html');

    return pages;
  })();
}
