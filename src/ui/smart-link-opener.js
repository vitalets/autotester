/**
 * Opening links via chrome api:
 * - open chrome:// urls
 * - check existing tabs and activate instead of opening for then same url
 */

const thenChrome = require('then-chrome');

exports.start = function () {
  document.body.addEventListener('click', onClick);
};

exports.stop = function () {
  document.body.removeEventListener('click', onClick);
};

exports.open = function (url) {
  thenChrome.tabs.query({})
    .then(tabs => {
      const tab = tabs.find(tab => tab.url === url);
      return tab
        ? thenChrome.tabs.update(tab.id, {active: true})
        : thenChrome.tabs.create({url});
    })
};

function onClick(event) {
  const target = event.target;
  if (target.tagName === 'A' && target.href) {
    event.preventDefault();
    exports.open(target.href);
  }
}
