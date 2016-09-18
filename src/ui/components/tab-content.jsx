const {observer} = require('mobx-react');
const classNames = require('classnames');
const uiStore = require('../stores/ui').store;

module.exports = observer(function TabContent(props) {
  const isActive = uiStore.activeTabId === props.id;
  const className = classNames({'hidden': !isActive});
  return (
    <div className={className}>{props.children}</div>
  );
});
