
const {observer} = require('mobx-react');
const mobx = require('mobx');
const store = require('../../store').store;

module.exports = observer(class StopOnError extends React.Component {
  constructor() {
    super();
    this.onChange = mobx.action(this.onChange.bind(this));
  }
  onChange(e) {
    store.stopOnError = e.target.checked;
  }
  render() {
    return (
      <label>
        <input type="checkbox" checked={store.stopOnError} onChange={this.onChange} style={{verticalAlign: 'middle'}}/>
        <span style={{marginLeft: '2px'}}>stop on error</span>
      </label>
    );
  }
});
