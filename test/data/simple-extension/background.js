chrome.runtime.onMessage.addListener(onMessage);

function onMessage(data, sender, sendResponse) {
  data = data || {};
  switch (data.action) {
    case 'fetch':
      fetch(data.url)
        .then(() => sendResponse())
        .catch(() => sendResponse());
      return true;
      break;
  }
}
