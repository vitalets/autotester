const mobx = require('mobx');
const {Textfield} = require('react-mdl');
const store = require('../store').store;
const CodeMirror = require('react-codemirror');
require('codemirror/mode/javascript/javascript');
const debounce = require('lodash.debounce');
window.store = store;
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
        <Textfield
          onChange={this.changeName}
          value={this.state.name}
          label="Snippet name"
          floatingLabel
          style={{width: '200px'}}
        />
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
