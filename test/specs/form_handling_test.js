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

// when pull to selenium replace require('selenium-webdriver') --> require('..')

var By = require('selenium-webdriver').By,
  until = require('selenium-webdriver').until,
  assert = require('selenium-webdriver/testing/assert'),
  test = require('selenium-webdriver/lib/test');

test.suite(function(env) {
  var driver;

  test.before(function() {
    driver = env.builder().build();
  });

  test.after(function() {
    driver.quit();
  });

  test.it('should click on submit input elements', function() {
    driver.get(test.Pages.formPage);
    driver.findElement(By.id('submitButton')).click();
    driver.wait(until.titleIs('We Arrive Here'), 1000);
  });

  test.it('should be able to click on image buttons', function() {
    driver.get(test.Pages.formPage);
    driver.findElement(By.id('imageButton')).click();
    driver.wait(until.titleIs('We Arrive Here'), 1000);
  });

  test.it('should be able to submit forms', function() {
    driver.get(test.Pages.formPage);
    driver.findElement(By.name('login')).submit();
    driver.wait(until.titleIs('We Arrive Here'), 1000);
  });

  test.it('should be able to submit form when inner INPUT is submitted', function() {
    driver.get(test.Pages.formPage);
    driver.findElement(By.id('checky')).submit();
    driver.wait(until.titleIs('We Arrive Here'), 1000);
  });

  test.it.skip('should be able to submit form when inner ELEMENT is submitted', function() {
    driver.get(test.Pages.formPage);
    driver.findElement(By.xpath('//form/p')).submit();
    driver.wait(until.titleIs('We Arrive Here'), 1000);
  });

});
