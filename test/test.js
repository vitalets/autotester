function log(msg) {
  document.querySelector('.msg').innerHTML = msg;
}
document.querySelector('.btn1').addEventListener('click', function () {
  log('clicked');
});
