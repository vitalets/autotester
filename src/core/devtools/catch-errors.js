/**
 * Catches all errors and shows it in <PRE> element
 */

window.addEventListener('error', e => {
  setError(`${e.message} in ${e.filename}:${e.lineno}`);
});

// see: https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection
window.addEventListener('unhandledrejection', e => {
  setError(`Unhandled promise rejection: ${e.reason}`);
});

setError('');

function setError(text) {
  const el = document.getElementById('error');
  if (text) {
    el.textContent = text;
    el.style.display = 'block';
  } else {
    el.textContent = '';
    el.style.display = 'none';
  }
}
