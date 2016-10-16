const {observer} = require('mobx-react');
const state = require('../state');
const SnippetEditor = require('./snippet-editor');
const SnippetIndex = require('./snippet-index');
const FilesIndex = require('./files-index');

module.exports = observer(function TestsTab() {
  if (state.isInnerFiles) {
    return state.selectedSnippet
      ? <SnippetEditor/>
      : <SnippetIndex count={state.innerFiles.length}/>;
  } else {
    return (
      <FilesIndex count={state.files.length} url={state.filesSourceUrl}/>
    );
  }
});
