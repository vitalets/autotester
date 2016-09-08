/**
 * Open urls via chrome api:
 * - check existing tabs and activate instead of opening the same url
 * - can listen <A> clicks and open system chrome:// urls
 */

const thenChrome = require('then-chrome');

exports.open = function (url) {
  thenChrome.tabs.query({})
    .then(tabs => {
      const tab = tabs.find(tab => tab.url === url);
      return tab
        ? thenChrome.tabs.update(tab.id, {active: true})
        : thenChrome.tabs.create({url});
    })
};

exports.listen = function () {
  document.body.addEventListener('click', onClick);
};

exports.stop = function () {
  document.body.removeEventListener('click', onClick);
};

function onClick(event) {
  const target = event.target;
  if (target.tagName === 'A' && target.href) {
    event.preventDefault();
    exports.open(target.href);
  }
}
