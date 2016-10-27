
const {observer} = require('mobx-react');
const state = require('../../state');
const Dropdown = require('../utils/dropdown');

module.exports = observer(class TargetsDropdown extends React.Component {
  render() {
    const items = state.targets.map(target => {
      return {
        value: target.id,
        text: target.name
      };
    });
    return (
      <Dropdown id="targets"
                value={state.selectedTargetId}
                items={items}
                align="right"
                onChange={item => state.selectedTargetId = item.value}
      />
    );
  }
});
