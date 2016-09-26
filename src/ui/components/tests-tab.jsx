const {observer} = require('mobx-react');
const store = require('../store').store;
const SnippetEditor = require('./snippet-editor');
const SnippetIndex = require('./snippet-index');
const FilesIndex = require('./files-index');

module.exports = observer(function TestsTab() {
  if (store.isSnippets()) {
    return store.selectedSnippet
      ? <SnippetEditor/>
      : <SnippetIndex count={store.snippets.length}/>;
  } else {
    return (
      <FilesIndex count={store.tests.length} url={store.testsSourceUrl}/>
    );
  }
});
