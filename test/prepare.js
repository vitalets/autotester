/**
 * Preparation for running own selenium tests in autotester (browser env)
 * see: selenium-webdriver/lib/test/**
 */

const FILE_SERVER_BASE_URL = 'http://127.0.0.1:2310/common/';

wrapTest();
wrapRequire();

function wrapRequire() {
  const originalRequire = window.require;
  window.require = function (moduleName) {
    switch (moduleName) {
      case '../lib/test/fileserver':
        return {
          Pages: window.test.Pages,
          whereIs: window.test.whereIs,
        };
      default:
        // selenium tests require webdriver as '..'
        moduleName = moduleName.replace('..', 'selenium-webdriver');
        return originalRequire(moduleName);
    }
  };
}

function wrapTest() {
  const originalTest = window.test;
  window.test = {
    suite: suite,
    after: originalTest.after,
    afterEach: originalTest.afterEach,
    before: originalTest.before,
    beforeEach: originalTest.beforeEach,
    it: originalTest.it,
    describe: originalTest.describe,
    ignore: originalTest.ignore,
    Pages: getPages(),
    whereIs: whereIs
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
    return {
      build: function() {
        return window.driver.getSession()
          ? window.driver
          : window.driver = new window.Driver();
      }
    };
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
