
const {observer} = require('mobx-react');
const mobx = require('mobx');
const store = require('../store').store;
const Dropdown = require('./dropdown');

module.exports = observer(class TestsDropdown extends React.Component {
  constructor() {
    super();
    this.handleChange = mobx.action(this.handleChange.bind(this));
  }
  handleChange(test) {
    store.selectedTest = test.value;
  }
  render() {
    // todo: use computed
    const items = store.tests.map(test => {
      return {value: test, text: test};
    });
    if (items.length) {
      items.unshift({value: '', text: 'All tests'})
    }
    return (
      <Dropdown id="tests"
                value={store.selectedTest}
                items={items}
                onChange={this.handleChange}
      />
    );
  }
});
