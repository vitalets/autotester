const {observer} = require('mobx-react');
const state = require('../state');
const Editor = require('./editor');
const NoFileSelected = require('./no-file-selected');

module.exports = observer(function TestsTab() {
    return state.selectedFile ? <Editor/> : <NoFileSelected/>;
});
