
const {observer} = require('mobx-react');
const state = require('../../state');
const Dropdown = require('../utils/dropdown');

module.exports = observer(class TestsDropdown extends React.Component {
  getItems() {
    const items = state.files
      .filter(file => !file.isSetup)
      .map(file => {
      return {
        value: file.path,
        text: file.path
      };
    });
    if (items.length) {
      const text = `All (${items.length} file${items.length === 1 ? '' : 's'})`;
      items.unshift({value: '', text})
    }
    return items;
  }
  render() {
    const items = this.getItems();
    return (
      <Dropdown id="tests"
                value={state.selectedFile}
                items={items}
                onChange={item => state.selectedFile = item.value}

      />
    );
  }
});
