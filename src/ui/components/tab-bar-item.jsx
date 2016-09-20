
module.exports = function TabBarItem(props) {
  const style = props.right ? {marginLeft: 'auto'} : {};
  return (
    <span>
      <i className="material-icons" style={{verticalAlign: 'middle', marginRight: '4px'}}>{props.icon}</i>
      <span style={{verticalAlign: 'middle'}}>{props.text}</span>
    </span>
  );
};

