const mobx = require('mobx');
const {Textfield, Icon, Button} = require('react-mdl');
const classNames = require('classnames');
const CodeMirror = require('react-codemirror');
require('codemirror/mode/javascript/javascript');
const debounce = require('lodash.debounce');
const state = require('../../state');
const {TAB} = require('../../state/constants');
const editor = require('../../controllers/editor');


const options = {
  lineNumbers: true,
  mode: 'javascript',
  viewportMargin: Infinity,
  readOnly: false,
};

module.exports = class Editor extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      code: '',
    };
    this.saveName = debounce(() => editor.saveName(this.state.name), 500);
    this.saveCode = debounce(() => editor.saveCode(this.state.code), 500);
  }
  componentWillMount() {
    this.disposerState = mobx.autorun(() => {
      this.setState({
        name: state.selectedFile,
        code: state.selectedFileContent,
      });
    });

    // see: http://stackoverflow.com/questions/8349571/codemirror-editor-is-not-loading-content-until-clicked
    this.disposerEditor = mobx.autorun(() => {
      if (state.selectedTab === TAB.TESTS) {
        this.updateEditor();
      }
    });
  }
  componentWillUnmount() {
    this.disposerState();
    this.disposerEditor();
  }
  changeName(e) {
    this.setState({name: e.target.value});
    this.saveName();
  }
  changeCode(code) {
    this.setState({code});
    this.saveCode();
  }
  updateEditor() {
    setTimeout(() => {
      if (this._editor) {
        this._editor.codeMirror.refresh();
      }
    }, 100);
  }
  deleteFile() {
    if (window.confirm(`Delete: ${state.selectedFile}?`)) {
      editor.deleteFile();
    }
  }
  addFile() {
    editor.addFile();
  }
  render() {
    options.readOnly = state.isInnerFiles ? false : 'nocursor';
    const className = classNames('flex-container', {'gray-bg': !state.isInnerFiles});
    return (
      <div className="flex-container" id="editor">
        {state.isInnerFiles ? this.renderControls() : null}
        <CodeMirror
          className={className}
          ref={ref => this._editor = ref}
          value={this.state.code}
          onChange={code => this.changeCode(code)}
          options={options}
        />
      </div>
    );
  }
  renderControls() {
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <Textfield
          onChange={e => this.changeName(e)}
          value={this.state.name}
          label="Filename"
          floatingLabel
          style={{width: '300px', marginRight: 'auto'}}
        />
        <Button raised style={{marginRight: '15px'}} onClick={() => this.addFile()} data-test-id="create">
          <Icon name="add"/>
          <span className="button-text">New file</span>
        </Button>
        <Button raised onClick={() => this.deleteFile()} data-test-id="delete">
          <Icon name="delete" disabled={!this.state.name}/>
          <span className="button-text">Delete</span>
        </Button>
      </div>
    );
  }
};
