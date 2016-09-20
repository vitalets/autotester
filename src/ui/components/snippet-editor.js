const {observer} = require('mobx-react');
const {Textfield} = require('react-mdl');
const store = require('../store').store;
const CodeMirror = require('react-codemirror');
require('codemirror/mode/javascript/javascript');

const options = {
  lineNumbers: true,
  mode: 'javascript',
  viewportMargin: Infinity,
};

module.exports = observer(class SnippetEditor extends React.Component {
  constructor() {
    super();
    this.state = {
      name: 'abc',
      code: 'code'
    };
    this.changeName = this.changeName.bind(this);
    this.changeCode = this.changeCode.bind(this);
  }
  changeName(e) {
    this.setState({name: e.target.value});
  }
  changeCode(code) {
    this.setState({code});
  }
  render() {
    return (
      <div>
        <Textfield
          onChange={this.changeName}
          value={this.state.name}
          label="Snippet name"
          floatingLabel
          style={{width: '200px'}}
        />
        <CodeMirror ref="editor" value={this.state.code} onChange={this.changeCode} options={options}/>
      </div>
    );
  }
});
