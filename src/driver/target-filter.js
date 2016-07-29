/**
 * Filters debugger targets that we can use
 */

exports.isCorrectTarget = function (target) {
  return isSuitableType(target)
    && !isDevtools(target)
    && !isAutotesterBg(target)
    && !isAutotesterUi(target);
};

function isSuitableType(target) {
  // allowing 'background_page' type is extra feature to test chrome extensions
  return target.type === 'page' || target.type === 'background_page';
}

function isDevtools(target) {
  return target.url.startsWith('chrome-devtools://');
}

function isAutotesterBg(target) {
  return target.type === 'background_page' && target.extensionId === chrome.runtime.id;
}

function isAutotesterUi(target) {
  return target.type === 'page' && target.url === chrome.runtime.getURL('ui/ui.html');
}
