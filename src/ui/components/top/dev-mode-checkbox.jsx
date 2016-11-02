
const {observer} = require('mobx-react');
const mobx = require('mobx');
const state = require('../../state');

module.exports = observer(class DevModeCheckbox extends React.Component {
  constructor() {
    super();
    this.onChange = mobx.action(this.onChange.bind(this));
  }
  onChange(e) {
    state.devMode = e.target.checked;
  }
  render() {
    return (
      <label>
        <input type="checkbox" checked={state.devMode} onChange={this.onChange} style={{verticalAlign: 'middle'}}/>
        <span style={{marginLeft: '2px'}} title="Stop on error and don't close tab">dev mode</span>
      </label>
    );
  }
});
