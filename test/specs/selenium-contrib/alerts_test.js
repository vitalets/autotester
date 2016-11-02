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
// https://github.com/SeleniumHQ/selenium/blob/master/java/client/test/org/openqa/selenium/AlertsTest.java

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
    driver.get(test.Pages.alertsPage);
  });

  test.after(function() {
    driver.quit();
  });

  describe('alerts', function () {

    test.it('should be able to overwride window.alert', function () {
      driver.executeScript('window.alert = function(msg) { document.getElementById("text").innerHTML = msg; }');
      driver.findElement(By.id('alert')).click();
    });

    test.it('should accept alert', function () {
      driver.findElement(By.id('alert')).click();
      // todo: use driver.wait(until.alertIsPresent()); when it will be possible
      driver.sleep(3000);
      driver.switchTo().alert().accept();

      // If we can perform any action, we're good to go
      assert(driver.getTitle()).equalTo('Testing Alerts');
    });

  });

});
