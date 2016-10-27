const {observer} = require('mobx-react');
const {Icon, Button} = require('react-mdl');
const state = require('../../state');
const editor = require('../../controllers/editor');

module.exports = observer(class NoSelectedFile extends React.Component {
  render() {
    return (
      <div className="no-file-selected">
        <div>
          You have <strong>{state.files.length}</strong> test file{state.files.length === 1 ? '' : 's'}<br/>
          {state.filesSourceUrl ? this.renderSourceUrl() : null}
        </div>
        {state.isInnerFiles ? this.renderNewFileButton() : null}
        {this.renderFlagsNote()}
      </div>
    );
  }

  renderNewFileButton() {
    return (
      <Button raised style={{marginTop: '25px'}} onClick={() => editor.addFile()}>
        <Icon name="add"/>
        <span className="button-text">Create new file</span>
      </Button>
    );
  }

  renderSourceUrl() {
    return (
      <span>Loaded from URL: <a href={state.filesSourceUrl}>{state.filesSourceUrl}</a><br/></span>
    );
  }

  renderFlagsNote() {
    return (
      <div className="flags-note">
        To remove warning <b>Autotester is debugging this browser</b> please
        enable <a href="chrome://flags#silent-debugger-extension-api">silent-debugger-extension-api</a> flag.
      </div>
    );
  }
});

