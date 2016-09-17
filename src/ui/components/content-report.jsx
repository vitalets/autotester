const {observer} = require('mobx-react');
const uiStore = require('../stores/ui').store;

module.exports = observer(function ContentReport() {
  const className = classNames({hidden: uiStore.activeTabId !== 'report'});
  return (
    <div className={className}>
      report
    </div>
  );
});
