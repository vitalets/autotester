# Autotester
Chrome extension for automated web testing

## Overview
Use power of chrome devtools to develop and run functional tests for any website.


Key features:  

* easy setup: no additional utils needed except extension itself
* emulate user actions: mouse clicks and keyboard inputs
* catch and mock http requests
* built-in test runner and assertion library

## Demo 
 
## Getting started
In this guide we will write simple test for checking that google search is works correctly.

Test plan:
 1. Open `https://google.com`
 2. Input "kitten" into search bar
 3. Press Search button
 4. Assert that http request with `q=kitten` was done
 5. Assert that link to `http://kitten.com` is shown in search results
 
Let's start.
1. Setup
  a. Download and unpack latest [autotester.zip](/master)
  b. Add extension to chrome from `/src` folder of zip. 
  The easiest way is to open `chrome://extensions` tab and drag-and-drop `/src` folder there
  c. Open developer tools and click on **Autotester** panel. You should see that `tests/index.js` not found, 
  that's ok.
 
2. Develop the test
All test files should be located in `/src/tests/` folder of unpacked zip.
Autotester requires only one file - `/src/tests/index.js` that is configuration file 
describing all other tests.

So let's create two files:
- `/src/tests/index.js` - configuration file
- `/src/tests/google.js` - test itself

```js
// index.js
window.autotesterConfig = {
  tests: [
    'google.js'
  ]
};
```

Tests 
```js
// google.js
describe('google', function () {
  it('should perform search', function () {
    return Promise.resolve()
      .then(() => page.navigate('https://www.google.com/ncr'))
      .then(() => wait.ms(500))
      .then(() => fiddler.start())
      .then(() => page.type('input[name="q"]', 'autotester'))
      .then(() => wait.ms(500))
      .then(() => page.click('button[name="btnG"]'))
      .then(() => wait.ms(500))
      .then(() => fiddler.stop())
      .then(() => fiddler.assert({
        urlStart: 'https://www.google.com/complete',
        urlParams: {q: 'autotester'}
      }))
  });
});
```
 
3. Test the test
 4. Open `/src` folder with your favorite editor and create 2 files:
  - `/src/index.js` 
  - 
 
## FAQ
 1. What are functional tests and how do they differ from unit tests?


