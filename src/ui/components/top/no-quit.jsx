
const {observer} = require('mobx-react');
const mobx = require('mobx');
const store = require('../../store').store;

module.exports = observer(class NoQuit extends React.Component {
  constructor() {
    super();
    this.onChange = mobx.action(this.onChange.bind(this));
  }
  onChange(e) {
    store.noQuit = e.target.checked;
  }
  render() {
    return (
      <label>
        <input type="checkbox" checked={store.noQuit} onChange={this.onChange} style={{verticalAlign: 'middle'}}/>
        <span>no quit</span>
      </label>
    );
  }
});
