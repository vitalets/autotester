const mobx = require('mobx');
const {Textfield, Icon, Button} = require('react-mdl');
const store = require('../store').store;
const CodeMirror = require('react-codemirror');
require('codemirror/mode/javascript/javascript');
const debounce = require('lodash.debounce');

const options = {
  lineNumbers: true,
  mode: 'javascript',
  viewportMargin: Infinity,
};

module.exports = class SnippetEditor extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      code: '',
    };
    this.changeName = this.changeName.bind(this);
    this.changeCode = this.changeCode.bind(this);
    this.updateStore = debounce(mobx.action(this.updateStore.bind(this)), 500);
  }
  componentDidMount() {
    this.disposer = mobx.autorun(() => {
      if (store.selectedSnippet) {
        // todo: use computed
        const snippet = this.getSelectedSnippet();
        if (snippet) {
          this.setState({name: snippet.name, code: snippet.code});
          return;
        }
      }
      this.setState({name: '', code: ''});
    });
  }
  componentWillUnmount() {
    this.disposer();
  }
  changeName(e) {
    this.setState({name: e.target.value});
    this.updateStore();
  }
  changeCode(code) {
    this.setState({code});
    this.updateStore();
  }
  updateStore() {
    // todo: use computed
    const snippet = this.getSelectedSnippet();
    if (snippet) {
      snippet.name = this.state.name;
      snippet.code = this.state.code;
    }
  }
  getSelectedSnippet() {
    return store.snippets.find(s => s.id === store.selectedSnippet);
  }
  render() {
    return (
      <div className="flex-container">
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Textfield
            onChange={this.changeName}
            value={this.state.name}
            label="Snippet name"
            floatingLabel
            style={{width: '200px', marginRight: 'auto'}}
          />
          <Button raised style={{marginRight: '15px'}}>
            <Icon name="add"/>
            <span className="button-text">New snippet</span>
          </Button>
          <Button raised>
            <Icon name="delete"/>
            <span className="button-text">Delete</span>
          </Button>
        </div>
        <CodeMirror
          className="flex-container"
          ref="editor"
          value={this.state.code}
          onChange={this.changeCode}
          options={options}
        />
      </div>
    );
  }
};
