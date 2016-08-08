
const messaging = require('../background/messaging');

document.getElementById('run').addEventListener('click', run);

messaging.start();

function run() {
  messaging.send(messaging.names.RUN);
}

function activateSelfTab() {
  return thenChrome.tabs.getCurrent()
    .then(tab => thenChrome.tabs.update(tab.id, {active: true}));
}
