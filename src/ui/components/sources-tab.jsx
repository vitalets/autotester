
const {observer} = require('mobx-react');
// const CodeMirror = require('codemirror');
// require('codemirror/mode/javascript/javascript');

module.exports = observer(function SourcesTab() {
  return <div>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
  </div>
});

/*
 const editor = CodeMirror(document.getElementById('code'), {
 lineNumbers: true,
 mode: 'javascript',
 });

 editor.doc.setValue(`function myScript() {
 return 100;
 }`);

 editor.on('changes', (a, b) => {
 console.log(editor.doc.getValue());
 });
 */
