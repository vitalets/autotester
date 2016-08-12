'use strict';

var assert = require('../testing/assert');
var test = require('../lib/test');

test.suite(function(env) {
  var driver;

  test.before(function () {
    driver = env.builder().build();
  });

  test.after(function () {
    driver.quit();
  });

  test.beforeEach(function () {
    driver.get(test.Pages.echoPage);
  });

  describe('network requests', function () {

    test.it('should catch normal navigation', function () {
      driver.requests().catch();
      driver.get(test.Pages.echoPage);
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.Pages.echoPage})).equalTo(1);
    });

    test.it('should catch js navigation', function () {
      driver.requests().catch();
      driver.executeScript(function() {
        location.href = location.href + '?x=1';
      });
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.Pages.echoPage + '?x=1'})).equalTo(1);
    });

    test.it('should catch XMLHttpREquest', function () {
      driver.requests().catch();
      driver.executeScript(function() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', location.href);
        xhr.send();
      });
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.Pages.echoPage})).equalTo(1);
    });

    test.it('should catch fetch', function () {
      driver.requests().catch();
      driver.executeScript(function() {
        fetch(location.href);
      });
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.Pages.echoPage})).equalTo(1);
    });

    test.it('should catch new Image() load', function () {
      driver.requests().catch();
      driver.executeScript(function() {
        const img = new Image();
        img.src = 'image.png';
      });
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.whereIs('image.png')})).equalTo(1);
    });

    test.it('should catch <img> load', function () {
      driver.requests().catch();
      driver.executeScript(function() {
        const img = document.createElement('img');
        img.src = 'image.png';
        document.body.appendChild(img);
      });
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.whereIs('image.png')})).equalTo(1);
    });

    test.it('should catch <script> load', function () {
      driver.requests().catch();
      driver.executeScript(function() {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'script.js';
        document.body.appendChild(script);
      });
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.whereIs('script.js')})).equalTo(1);
    });

    test.it('should catch <link> stylesheet load', function () {
      driver.requests().catch();
      driver.executeScript(function() {
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'style.css';
        document.body.appendChild(css);
      });
      driver.requests().stop();
      assert(driver.requests().getCount({url: test.whereIs('style.css')})).equalTo(1);
    });

  });

});
