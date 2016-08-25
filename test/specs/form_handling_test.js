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

'use strict';

var By = require('..').By,
  until = require('..').until,
  Key = require('..').Key,
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

  describe('form_handling', function () {

    test.it('should click on submit input elements', function () {
      driver.get(test.Pages.formPage);
      driver.findElement(By.id('submitButton')).click();
      driver.wait(until.titleIs('We Arrive Here'), 1000);
    });

    test.it('should be able to click on image buttons', function () {
      driver.get(test.Pages.formPage);
      driver.findElement(By.id('imageButton')).click();
      driver.wait(until.titleIs('We Arrive Here'), 1000);
    });

    test.it('should submit forms', function () {
      driver.get(test.Pages.formPage);
      driver.findElement(By.name('login')).submit();
      driver.wait(until.titleIs('We Arrive Here'), 1000);
    });

    test.it('should submit form when inner INPUT is submitted', function () {
      driver.get(test.Pages.formPage);
      driver.findElement(By.id('checky')).submit();
      driver.wait(until.titleIs('We Arrive Here'), 1000);
    });

    test.it.skip('should submit form when inner ELEMENT is submitted', function () {
      driver.get(test.Pages.formPage);
      driver.findElement(By.xpath('//form/p')).submit();
      driver.wait(until.titleIs('We Arrive Here'), 1000);
    });

    test.it.skip('should submit form using newline char', function () {
      driver.get(test.Pages.formPage);
      var nestedForm = driver.findElement(By.id('nested_form'));
      var input = nestedForm.findElement(By.name('x'));
      input.sendKeys('\n');
      driver.wait(until.titleIs('We Arrive Here'), 1000);
      assert(driver.getCurrentUrl()).endsWith('?x=name');
    });

    test.it.skip('should submit form using ENTER key', function () {
      driver.get(test.Pages.formPage);
      var nestedForm = driver.findElement(By.id('nested_form'));
      var input = nestedForm.findElement(By.name('x'));
      input.sendKeys(Key.ENTER);
      driver.wait(until.titleIs('We Arrive Here'), 1000);
      assert(driver.getCurrentUrl()).endsWith('?x=name');
    });

  });

});
