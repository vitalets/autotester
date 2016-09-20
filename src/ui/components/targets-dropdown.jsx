
const {observer} = require('mobx-react');
const mobx = require('mobx');
const store = require('../store').store;
const Dropdown = require('./dropdown');

module.exports = observer(class TargetsDropdown extends React.Component {
  constructor() {
    super();
    this.handleChange = mobx.action(this.handleChange.bind(this));
  }
  handleChange(target) {
    store.selectedTarget = target.value;
  }
  render() {
    // todo: use computed
    const items = store.targets.map((target, index) => {
      return {value: index, text: target.name};
    });
    return (
      <Dropdown id="targets"
                value={store.selectedTarget}
                items={items}
                align="right"
                onChange={this.handleChange}
      />
    );
  }
});
