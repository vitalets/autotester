/**
 * Console replacement for devtools to show messages in page console and background console.
 * (As by default console calls in devtools are not visible)
 *
 * Depends on BackgroundProxy for communicating with background.
 */

(function () {
  wrapConsole();
  listenGlobalErrors();

  function wrapConsole() {
    wrapMethod('log');
    wrapMethod('warn');
    wrapMethod('error');
    wrapMethod('clear');
  }

  function wrapMethod(method) {
    const old = console[method];
    console[method] = function () {
      const args = addPrefix([].slice.call(arguments));
      old.apply(console, arguments);
      sendToBackground(method, args);
      sendToInspectedWindow(method, args);
    };
  }

  function sendToBackground(method, args) {
    const checkedArgs = stringify(args, {onlyCheck: true});
    BackgroundProxy.call({
      path: `console.${method}`,
      args: checkedArgs
    });
  }

  function sendToInspectedWindow(method, args) {
    const stringifiedArgs = stringify(args);
    const code = 'console.' + method + '(`' + stringifiedArgs.join('`, `') + '`)';
    chrome.devtools.inspectedWindow.eval(code, (result, exceptionInfo) => {
      if (exceptionInfo) {
        const args = ['error in eval', code, exceptionInfo];
        sendToBackground('error', addPrefix(args));
      }
    });
  }

  function addPrefix(args) {
    return ['[devtools]:'].concat(args);
  }

  function listenGlobalErrors() {
    window.onerror = function(message, source, lineno) {
      console.error(message, `${source}:${lineno}`);
      // todo: only sendToBackground to exclude circular error
    };

    // see: https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection
    window.addEventListener("unhandledrejection", event => {
      console.error('Unhandled promise rejection:', event);
    });
  }

  function stringify(args, params = {}) {
    return args.map(arg => {
      if (typeof arg === 'object') {
        try {
          const stringified = JSON.stringify(arg, false, 2);
          return params.onlyCheck ? arg : stringified;
        } catch (e) {
          return e.message;
        }
      } else {
        return arg;
      }
    });
  }

}());
