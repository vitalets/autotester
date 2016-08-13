/**
 * Implementation of selenium webdriver.Builder that always returns Autotester driver instance.
 */

const Driver = require('./');

class Builder {
  constructor () {
    // proxy unknown methods to return self
    return new Proxy(this, {
      get: function(target, prop){
        if (prop in target) {
          return target[prop];
        } else {
          return new Proxy(function () {}, {
            apply() {
              return target;
            }
          });
        }
      }
    });
  }
  build() {
    return new Driver();
  }
}

module.exports = Builder;
