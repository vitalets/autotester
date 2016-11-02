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
// https://github.com/SeleniumHQ/selenium/blob/master/java/client/test/org/openqa/selenium/ElementAttributeTest.java

'use strict';

var webdriver = require('..'),
  By = webdriver.By,
  assert = require('../testing/assert'),
  test = require('../lib/test');

test.suite(function(env) {
  var driver;

  test.before(function() {
    driver = env.builder().build();
  });

  test.beforeEach(function() {
    driver.get(test.Pages.formPage);
  });

  test.after(function() {
    driver.quit();
  });

  describe('element attribute', function () {

    test.it('should return value of disabled attribute as null if not set', function () {
      var input = driver.findElement(By.css('input#working'));
      assert(input.getAttribute('disabled')).equalTo(null);
      assert(input.isEnabled()).equalTo(true);

      var pElement = driver.findElement(By.id('peas'));
      assert(pElement.getAttribute('disabled')).equalTo(null);
      assert(pElement.isEnabled()).equalTo(true);
    });

    test.it('should indicated enabled/disabled prop', function () {
      var inputDisabled = driver.findElement(By.css('input#notWorking'));
      assert(inputDisabled.isEnabled()).equalTo(false);

      var inputEnabled = driver.findElement(By.css('input#working'));
      assert(inputEnabled.isEnabled()).equalTo(true);
    });

    test.it('should return disabled if element disabled by random strings', function () {
      var disabledTextElement1 = driver.findElement(By.id('disabledTextElement1'));
      assert(disabledTextElement1.isEnabled()).equalTo(false);

      var disabledTextElement2 = driver.findElement(By.id('disabledTextElement2'));
      assert(disabledTextElement2.isEnabled()).equalTo(false);

      var disabledTextElement3 = driver.findElement(By.id('disabledSubmitElement'));
      assert(disabledTextElement3.isEnabled()).equalTo(false);
    });

    test.it('should indicated disabled textarea', function () {
      var textArea = driver.findElement(By.css('textarea#notWorkingArea'));
      assert(textArea.isEnabled()).equalTo(false);
    });

    test.it('should indicated disabled select', function () {
      var enabled = driver.findElement(By.name('selectomatic'));
      assert(enabled.isEnabled()).equalTo(true);

      var disabled = driver.findElement(By.name('no-select'));
      assert(disabled.isEnabled()).equalTo(false);
    });
  });

});
