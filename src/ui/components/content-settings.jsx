const {observer} = require('mobx-react');
const uiStore = require('../stores/ui').store;

module.exports = observer(function ContentSettings() {
  const className = classNames({hidden: uiStore.activeTabId !== 'settings'});
  return (
    <div className={className}>
      settings
    </div>
  );
});
