# Autotester
Autotester is chrome extension that allows to develop and run automation tests right in browser.  
Tests are written in Javascript and can be executed over another tab of the same browser or any remote browser instance.

## Demo 
<img src="https://vitalets.github.io/autotester/autotester-demo.gif"/>

## Key features
* **Zero setup**  
  The setup is just drag-n-drop extension in chrome. No other stuff like Selenium, Node.js or Chromedriver is needed.
   
* **Convenient development**  
  Developing tests right in browser has some advantages. You can edit tests in first tab and check results in second.
  You can easily run particular test to debug. You can keep tab open after tests to inspect with devtools.
    
* **Capturing network requests**  
  Capturing network requests is working out of box. You can capture page loads, resources (img, script, etc),
  xhr requests and new tabs. No proxy needed. Please see [example](test/specs/extras/collect_network_requests_test.js).
    
* **Custom commands**  
  Tests are executed in extension context, so all of rich [chrome extensions API](https://developer.chrome.com/extensions/api_index)
  are available. You can defined custom commands to work with cookies, downloads, tabs, history etc and use it in your tests.

* **Selenium compatible syntax**  
  Tests syntax is compatible with [Selenium Javascript API](http://seleniumhq.github.io/selenium/docs/api/javascript/index.html)
  so it can be executed in nodejs and visa-versa (except custom commands).

* **Testing other chrome extensions**  
  With Autotester it is possible to attach to extensions background pages for testing.
  Please see [example](test/specs/extras/extension_switching_test.js).

* **Various places to store tests**  
  Tests can be stored right in browser, loaded from any local or remote http server (for example github) or loaded from local directory. 

* **Running tests on remote server**  
  Besides running tests in the same chrome instance it is possible to route commands to any selenium server.
  It can be [localhost standalone server](https://www.npmjs.com/package/selenium-standalone),
  [saucelabs](https://saucelabs.com), [browserstack](https://www.browserstack.com), etc.


## Project status
Autotester is in **early beta** now. Not all webdriver commands and features are supported. Yet.  
Please feel free to try it and share your feedback or ideas in [issues](issues) - help us to make it better!

## Getting started
1. Download latest [autotester.crx](https://vitalets.github.io/autotester/releases/autotester.crx)
2. Open chrome on `chrome://extensions` page
3. Drag-n-drop autotester.crx on that page, confirm permissions dialog
4. Click `A` button in browser panel to open tests management page

## Usage
Write tests using [Selenium Javascript API](http://seleniumhq.github.io/selenium/docs/api/javascript/index.html).  
*More detailed tutorial is coming soon..*

## Where to store tests
You can create as many tests as you like and store them right in browser as snippets. 
This is the easiest way but less reliable: if you occasionally remove extension tests will be lost. 
For more serious things it is recommended to serve tests from local or remote http server and keep them under version control.
The third option is to load tests from local directory without http server.
For that install unpacked extension from zip (not crx) and use `/tests` directory inside.

## How to contribute
If you see how to fix bug, typo or add new feature - you are welcome to contribute.

1. Install [node.js](https://nodejs.org) if not yet
2. Fork the repo and clone it:

   ```bash
   git clone https://github.com/<your_name>/autotester.git
   ```
   
3. Install needed npm packages:

   ```bash
   cd autotester
   npm i
   ```
   
4. Run dev watcher:

   ```bash
   npm run dev
   ```
   
5. Open chrome and load unpacked extension from `dist/unpacked-dev`.
6. Also load unpacked extension from `dist/unpacked-dev-selftest`. This is copy of Autotester needed for self testing.
7. Hack, push and make pull request. 

## License
MIT
