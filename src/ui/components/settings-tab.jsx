const {observer} = require('mobx-react');
const store = require('../store').store;
const mobx = require('mobx');
const SettingsMenu = require('./settings-menu');
const SettingsContent = require('./settings-content');
const SettingsTestsSource = require('./settings-tests-source');
const {SETTINGS_MENU} = require('../store/constants');

module.exports = observer(class SettingsTab extends React.Component {
  constructor() {
    super();
    this.handleMenuItemClick = mobx.action(this.handleMenuItemClick.bind(this));
  }
  handleMenuItemClick(itemId) {
    store.selectedSettingsMenuItem = itemId;
  }
  render() {
    return (
      <div className="flex-container" style={{flexDirection: 'row'}}>
        <SettingsMenu selected={store.selectedSettingsMenuItem} onClick={this.handleMenuItemClick}/>
        <SettingsContent>
          {this.renderContent()}
        </SettingsContent>
      </div>
    );
  }
  renderContent() {
    switch (store.selectedSettingsMenuItem) {
      case SETTINGS_MENU.TESTS_SOURCE: return <SettingsTestsSource/>;
      case SETTINGS_MENU.HUBS:
      case SETTINGS_MENU.TARGETS:
      default:
        return <div></div>;
    }
  }
});
