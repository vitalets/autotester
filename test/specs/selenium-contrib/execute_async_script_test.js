// Licensed to the Software Freedom Conservancy (SFC) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The SFC licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

// todo: use all tests from:
// https://github.com/SeleniumHQ/selenium/blob/master/java/client/test/org/openqa/selenium/ExecutingAsyncJavascriptTest.java

'use strict';

var webdriver = require('..'),
  assert = require('../testing/assert'),
  test = require('../lib/test');

test.suite(function(env) {
  var driver;

  test.before(function() {
    driver = env.builder().build();
  });

  test.after(function() {
    driver.quit();
  });

  describe('execute async script', function () {

    test.it('should return primitives', function () {
      driver.get(test.Pages.ajaxyPage);
      assert(driver.executeAsyncScript('arguments[arguments.length - 1](123);')).equalTo(123);
      assert(driver.executeAsyncScript('arguments[arguments.length - 1]("abc");')).equalTo('abc');
      assert(driver.executeAsyncScript('arguments[arguments.length - 1](false);')).equalTo(false);
      assert(driver.executeAsyncScript('arguments[arguments.length - 1](true);')).equalTo(true);
    });

    test.it('should return null and undefined as null', function () {
      driver.get(test.Pages.ajaxyPage);
      assert(driver.executeAsyncScript('arguments[arguments.length - 1](null);')).equalTo(null);
      assert(driver.executeAsyncScript('arguments[arguments.length - 1]();')).equalTo(null);
    });

    test.it('should return empty array', function () {
      driver.get(test.Pages.ajaxyPage);
      driver.executeAsyncScript('arguments[arguments.length - 1]([]);')
      .then(res => {
        assert(res).instanceOf(Array);
        assert(res.length).equalTo(0);
      });
    });

    test.it('should return array object', function () {
      driver.get(test.Pages.ajaxyPage);
      driver.executeAsyncScript('arguments[arguments.length - 1](new Array());')
        .then(res => {
          assert(res).instanceOf(Array);
          assert(res.length).equalTo(0);
        });
    });

    test.it('should return array of primitives', function () {
      driver.get(test.Pages.ajaxyPage);
      driver.executeAsyncScript('arguments[arguments.length - 1]([null, 123, "abc", true, false]);')
        .then(res => {
          assert(res).instanceOf(Array);
          assert(res.length).equalTo(5);
          assert(res[0]).equalTo(null);
          assert(res[1]).equalTo(123);
          assert(res[2]).equalTo('abc');
          assert(res[3]).equalTo(true);
          assert(res[4]).equalTo(false);
        });
    });

    test.it('should return web element', function () {
      driver.get(test.Pages.ajaxyPage);
      driver.executeAsyncScript('arguments[arguments.length - 1](document.body);')
        .then(res => {
          assert(res).instanceOf(webdriver.WebElement);
          assert(res.getTagName()).equalTo('body');
        });
    });

    test.it('should return array of web elements', function () {
      driver.get(test.Pages.ajaxyPage);
      driver.executeAsyncScript('arguments[arguments.length - 1]([document.body, document.body]);')
        .then(res => {
          assert(res).instanceOf(Array);
          assert(res.length).equalTo(2);
          assert(res[0]).instanceOf(webdriver.WebElement);
          assert(res[0].getTagName()).equalTo('body');
          assert(res[1]).instanceOf(webdriver.WebElement);
          assert(res[1].getTagName()).equalTo('body');
        });
    });

  });

});
