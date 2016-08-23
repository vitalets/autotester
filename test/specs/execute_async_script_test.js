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

  describe('execute_async_script', function () {

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

  });

});
