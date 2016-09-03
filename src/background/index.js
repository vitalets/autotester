/**
 * Background entry point
 */

// export thenChrome for debug
window.thenChrome = require('then-chrome');

const App = require('./app');

new App().start();

// https://github.com/evanshortiss/html5-fs
/*
var promisifyAll = require('es6-promisify-all');
var fs = promisifyAll(require('html5-fs'));
function saveFile(name, data) {
  return fs.initAsync(0)
    .then(() => fs.unlinkAsync(name))
    .then(() => fs.writeFileAsync(name, data));
}
*/
/*
var utils = require('../utils');

window.require = () => console.log('require');

saveFile('playground.js', `
 console.log('iframe before', window.a, window.parent.a);
 window.a = 222;
 console.log('iframe after', window.a, window.parent.a);
 //myfn(555)
 //sgsd

`).then(url => {


  const iframe = document.createElement('iframe');
  iframe.addEventListener('load', event => {
    console.log('iframe loaded', event)
    //iframe.contentWindow.myfn = a => console.warn(a);
    iframe.contentWindow.console.log = a => console.warn(a);
    iframe.contentWindow.onerror = function() {
      console.info('contentwindow on error')
    }
    console.log('before', window.a)

    load('/test/playground.js')
    //load(url)

    console.log('after', window.a)
  })

  document.body.appendChild(iframe);



  function load(url) {
    var document = iframe.contentWindow.document;
    return new Promise(function (resolve, reject) {
      console.log('Loading script', url);
      const script = document.createElement('script');
      script.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(script);
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Can not load script ${url}`));
      script.src = url;
    });
  }


})



//var url = 'filesystem:chrome-extension://cidkhbpkgpdkadkjpkfooofilpmfneog/persistent/playground.js';
// fetch(url)
//utils.loadScript(url).then(() => console.log(1), e => console.warn(e))
// var xhr = new XMLHttpRequest();
// xhr.open('GET', url);
// xhr.addEventListener('load', event => {
//   console.log('loaded', event.target.responseText)
// });
// xhr.send();

*/
