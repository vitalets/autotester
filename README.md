# Autotester
Autotester is chrome extension that allows to develop and run automation tests right in browser.  
Tests are written in Javascript and can be executed over another tab of the same browser or any remote browser instance.

## Demo 
todo: gif and link to crx

## Key features
* **zero setup**
    * just install extension in chrome
    * no other stuff like Selenium, Node.js or Chromedriver is needed
   
* **convenient development**
    * develop tests right in browser
    * toggle between tabs to see test source and result page
    * use devtools to check css selectors
    * select particular test to run and debug
    
* **extra commands out of box**
    * capture and mock network requests
    * opening new tabs
    * testing chrome extensions, attach to background pages
    * use any [chrome extensions API](https://developer.chrome.com/extensions/api_index) needed for your tests
    * (more commands coming soon)

* **various tests origins**
    * stored in browser
    * loaded from remote URL (e.g. github)
    * loaded from local directory

* **run on remote server**
    * sauce labs
    * browser stack
    * any custom selenium grid


## Getting started
1. Download latest [autotester.crx](https://vitalets.github.io/autotester/releases/autotester.crx)
2. Open chrome on `chrome://extensions` page
3. Drag-n-drop autotester.crx on that page, confirm permissions dialog
4. Click `A` button in browser panel to open tests management page

## Usage
Write tests using [Selenium Javascript API](http://seleniumhq.github.io/selenium/docs/api/javascript/index.html).  
More detailed tutorial is coming soon.

## How to help
There are many directions to grow so feel free to share your ideas in [issues](/issues).

## How to contribute
Contribution is very appreciated!  
Before non-trivial hacks please discuss approach in issues.

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
