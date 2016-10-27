const {observer} = require('mobx-react');
const state = require('../../state');
const Editor = require('../editor/editor');
const NoFileSelected = require('../editor/no-file-selected');

module.exports = observer(function Files() {
    return state.selectedFile ? <Editor/> : <NoFileSelected/>;
});
