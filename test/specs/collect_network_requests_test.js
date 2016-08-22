'use strict';

var assert = require('../testing/assert');
var test = require('../lib/test');

test.suite(function(env) {
  var driver;

  test.before(function () {
    driver = env.builder().build();
  });

  test.beforeEach(function () {
    driver.get(test.Pages.echoPage);
    driver.requests().reset();
  });

  test.after(function () {
    driver.quit();
  });

  describe('network requests', function () {

    test.it('should collect normal navigation', function () {
      driver.requests().collect();
      driver.get(test.Pages.echoPage);
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.Pages.echoPage})).equalTo(1);
    });

    test.it('should collect js navigation', function () {
      driver.requests().collect();
      driver.executeScript(function() {
        location.href = location.href + '?x=1';
      });
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.Pages.echoPage + '?x=1'})).equalTo(1);
    });

    test.it('should collect XMLHttpREquest', function () {
      driver.requests().collect();
      driver.executeScript(function() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', location.href);
        xhr.send();
      });
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.Pages.echoPage})).equalTo(1);
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

    test.it.skip('should stop in case of error', function () {
      // todo:
      // driver.requests().collect();
      // driver.get(test.Pages.echoPage);
      // driver.executeScript(function() {
      //   throw new Error('some error');
      // })
    });

    test.it('should limit requests', function () {
      driver.requests().limit(1);
      driver.requests().collect();
      driver.get(test.Pages.echoPage);
      driver.requests().stop();
      assert(driver.requests().getCount()).equalTo(1);
    });

    test.it('should dump to string', function () {
      driver.requests().collect();
      driver.get(test.Pages.echoPage);
      driver.requests().stop();
      assert(driver.requests().dump()).equalTo([
        'Collected 2 requests:',
        'GET http://127.0.0.1:2310/common/echo',
        'GET http://127.0.0.1:2310/favicon.ico',
      ].join('\n'));
    });

    test.it('should dump to console', function () {
      driver.requests().collect();
      driver.get(test.Pages.echoPage);
      driver.requests().stop();
      const consoleMock = {log: s => consoleMock.s = s};
      driver.requests().dump(consoleMock).then(() => {
        assert(consoleMock.s).equalTo([
          'Collected 2 requests:',
          'GET http://127.0.0.1:2310/common/echo',
          'GET http://127.0.0.1:2310/favicon.ico',
        ].join('\n'));
      });
    });


    test.it('should collect requests from another target', function () {
      driver.requests().collect();
      driver.executeScript(function() {
        setTimeout(() => fetch(location.href), 1000);
      });
      driver.switchTo().newTab(test.Pages.simpleTestPage);
      driver.sleep(1000);
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.Pages.echoPage})).equalTo(1);
    });

  });

});
