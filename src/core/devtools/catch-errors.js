/**
 * Catches all unhandled errors and promise rejections
 */

window.addEventListener('error', e => {
  infoblock.error(`${e.message} in ${e.filename}:${e.lineno}`);
});

// see: https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection
window.addEventListener('unhandledrejection', e => {
  infoblock.error(e.reason);
});
