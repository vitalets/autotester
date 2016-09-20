
const {observer} = require('mobx-react');
const mobx = require('mobx');
const store = require('../store').store;
const Dropdown = require('./dropdown');

module.exports = observer(class TestsDropdown extends React.Component {
  constructor() {
    super();
    this.setSelected = mobx.action(this.setSelected.bind(this));
  }
  getItems() {
    const items = [];
    if (store.isSnippets()) {
      store.snippets.forEach(snippet => {
        items.push({value: snippet.id, text: snippet.name});
      });
    } else {
      store.tests.forEach(test => {
        items.push({value: test, text: test});
      });
    }
    if (items.length) {
      items.unshift({value: '', text: 'All'})
    }
    return items
  }
  getSelected() {
    return store.isSnippets() ? store.selectedSnippet : store.selectedTest;
  }
  setSelected(item) {
    if (store.isSnippets()) {
      store.selectedSnippet = item.value;
    } else {
      store.selectedTest = item.value;
    }
  }
  render() {
    // todo: use computed
    const items = this.getItems();
    return (
      <Dropdown id="tests"
                value={this.getSelected()}
                items={items}
                onChange={this.setSelected}

      />
    );
  }
});
