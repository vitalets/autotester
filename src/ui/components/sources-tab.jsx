const {observer} = require('mobx-react');
const store = require('../store').store;
const SnippetEditor = require('./snippet-editor');

module.exports = observer(function SourcesTab() {
  if (store.isSnippets()) {
    return (
      <SnippetEditor/>
    );
  } else {
    return (
      <div>
        <div>Tests successfully loaded from: {store.testsSourceUrl}</div>
        <div>Files found: ${store.tests.length}</div>
      </div>
    );
  }
});
