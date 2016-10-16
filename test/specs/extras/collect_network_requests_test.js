'use strict';

var webdriver = require('..');
var assert = require('../testing/assert');
var test = require('../lib/test');

test.suite(function(env) {
  var driver;

  test.before(function () {
    driver = env.builder().build();
  });

  test.beforeEach(function () {
    driver.get(test.Pages.echoPage);
  });

  test.after(function () {
    driver.quit();
  });

  describe('network requests', function () {

    test.it('should collect normal navigation and apply filter', function () {
      driver.requests().collect();
      driver.get(test.Pages.echoPage);
      driver.requests().stop();
      assert(driver.requests().getCount({type: 'document', url: test.Pages.echoPage})).equalTo(1);
      assert(driver.requests().getCount({url: test.Pages.echoPage})).equalTo(1);
      assert(driver.requests().getCount({type: 'document'})).equalTo(1);
      assert(driver.requests().getCount({url: 'abc'})).equalTo(0);
    });

    test.it('should collect js navigation', function () {
      driver.requests().collect();
      driver.executeScript(function(newUrl) {
        location.href = newUrl;
      }, test.Pages.simpleTestPage);
      driver.wait(webdriver.until.urlIs(test.Pages.simpleTestPage));
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.Pages.simpleTestPage})).equalTo(1);
    });

    test.it('should collect XMLHttpREquest', function () {
      driver.requests().collect();
      driver.executeScript(function() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', location.href);
        xhr.send();
      });
      driver.requests().stop();
      assert(driver.requests().getCount({type: 'xhr', url: test.Pages.echoPage})).equalTo(1);
    });

    test.it('should collect fetch', function () {
      driver.requests().collect();
      driver.executeScript(function() {
        fetch(location.href);
      });
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.Pages.echoPage})).equalTo(1);
    });

    test.it('should collect new Image() load', function () {
      driver.requests().collect();
      driver.executeScript(function() {
        const img = new Image();
        img.src = 'image.png';
      });
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.whereIs('image.png')})).equalTo(1);
    });

    test.it('should collect <img> load', function () {
      driver.requests().collect();
      driver.executeScript(function() {
        const img = document.createElement('img');
        img.src = 'image.png';
        document.body.appendChild(img);
      });
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.whereIs('image.png')})).equalTo(1);
    });

    test.it('should collect <script> load', function () {
      driver.requests().collect();
      driver.executeScript(function() {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'script.js';
        document.body.appendChild(script);
      });
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.whereIs('script.js')})).equalTo(1);
    });

    test.it('should collect <link> stylesheet load', function () {
      driver.requests().collect();
      driver.executeScript(function() {
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'style.css';
        document.body.appendChild(css);
      });
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.whereIs('style.css')})).equalTo(1);
    });

    test.it('should collect new tabs', function () {
      const initialHandle = driver.getWindowHandle();
      driver.executeScript(function(href) {
        const a = document.createElement('a');
        a.href = href;
        a.target = '_blank';
        a.textContent = 'newtablink';
        a.id = 'newtablink';
        document.body.appendChild(a);
      }, test.Pages.simpleTestPage);
      driver.requests().collect();
      const oldHandles = driver.getAllWindowHandles();
      driver.wait(until.elementLocated({id: 'newtablink'}), 1000).click();
      // delay needed for newtab to open
      driver.sleep(1000);
      driver.requests().stop();
      // close opened tab
      // todo: find more convenient way, maybe switchTo by url ?
      const newHandles = driver.getAllWindowHandles();
      webdriver.promise.all([oldHandles, newHandles, initialHandle]).then(([oldHandles, newHandles, initialHandle]) => {
        const newHandle = newHandles.filter(h => oldHandles.indexOf(h) === -1)[0];
        driver.switchTo().window(newHandle);
        driver.close();
        driver.switchTo().window(initialHandle);
      });
      assert(driver.requests().getCount({type: 'newtab', url: test.Pages.simpleTestPage})).equalTo(1);
    });

    // we can not test it as error should be uncaught to stop request catcher
    test.it.skip('should call .stop() in case of error / idle', function () {
      driver.requests().collect();
      driver.call(() => {
        throw new Error('some error');
      });
    });

    test.it('should dump to string', function () {
      driver.requests().collect();
      driver.executeScript(function() {
        fetch(location.href);
      });
      driver.requests().stop();
      assert(driver.requests().dump()).equalTo([
        'Collected 1 request(s):',
        `Other: GET ${runContext.baseUrl}echo`,
      ].join('\n'));
    });

    test.it('should dump to console', function () {
      driver.requests().collect();
      driver.executeScript(function() {
        fetch(location.href);
      });
      driver.requests().stop();
      const consoleMock = {log: s => consoleMock.s = s};
      driver.requests().dump(consoleMock).then(() => {
        assert(consoleMock.s).equalTo([
          'Collected 1 request(s):',
          `Other: GET ${runContext.baseUrl}echo`,
        ].join('\n'));
      });
    });

    test.it('should collect requests from another extension bg', function () {
      driver.switchTo().window(runContext.selftest.handle);
      driver.requests().collect();
      driver.switchTo().newTab(runContext.selftest.ui);
      driver.wait(until.titleContains('ready'));
      const code = `fetch('${test.Pages.simpleTestPage}')`;
      driver.executeScript(tests => {
        window.runTests(tests);
      }, [{path: 'test.js', code}]);
      driver.wait(until.titleContains('done'));
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.Pages.simpleTestPage})).equalTo(1);
    });

    test.it('should throw error on several .collect() calls', function () {
      driver.requests().collect();
      driver.requests().collect().catch(e => {
        assert(e.message).equalTo('Requests already in collecting state');
      });
      driver.requests().stop();
    });

    test.it('should not throw error on several .stop() calls', function () {
      driver.requests().collect();
      driver.requests().stop();
      driver.requests().stop();
    });

  });

});
