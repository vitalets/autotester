/**
 * Utils
 */

window.utils = {
  loadScript(url) {
    return new Promise(function (resolve, reject) {
      console.log('Loading script', url);
      const script = document.createElement('script');
      script.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(script);
      script.onload = resolve;
      script.onerror = reject;
      script.src = url;
    });
  }
};
