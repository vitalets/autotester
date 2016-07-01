
BackgroundProxy.listen();

window.debuggerBgRequestCatcher = new DebuggerRequestCatcher();
window.debuggerTabRequestCatcher = new DebuggerRequestCatcher();
window.webRequestCatcher = new WebRequestCatcher();
window.tabLoader = new TabLoader();
window.tabCatcher = new TabCatcher();

console.log('Autotester background started');

/*
 fetch('http://yandex.ru');

 a = new XMLHttpRequest();
 a.open('GET', 'http://ya.ru');
 a.send(null);
 */

