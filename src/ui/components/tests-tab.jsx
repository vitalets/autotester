const {observer} = require('mobx-react');
const store = require('../store').store;
const SnippetEditor = require('./snippet-editor');
const SnippetIndex = require('./snippet-index');

module.exports = observer(function TestsTab() {
  if (store.isSnippets()) {
    return store.selectedSnippet
      ? <SnippetEditor/>
      : <SnippetIndex count={store.snippets.length}/>;
  } else {
    return (
      <div>
        <div>Tests successfully loaded from: {store.testsSourceUrl}</div>
        <div>Files found: ${store.tests.length}</div>
      </div>
    );
  }
});
