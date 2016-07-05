
window.infoblock = {
  success(msg) {
    this._showMessage(msg, 'success');
  },
  error(msg) {
    this._showMessage(msg, 'error');
  },
  clear() {
    const el = this._getEl();
    el.innerHTML = '';
    el.style.display = 'none';
  },
  _showMessage(msg, className) {
    const el = this._getEl();
    el.innerHTML = msg;
    el.style.display = 'block';
    el.classList.remove('success', 'error');
    el.classList.add(className);
  },
  _getEl() {
    return document.getElementById('infoblock');
  }
};
