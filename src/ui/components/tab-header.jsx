module.exports = props => {
    return <a href="#starks-panel"
              className={classNames('mdl-tabs__tab', {'is-active': props.isActive})}
              style={props.style}
    >
        <i className="material-icons" style={{verticalAlign: 'middle', marginRight: '4px'}}>{props.icon}</i>
        <span style={{verticalAlign: 'middle'}}>{props.text}</span>
    </a>
};
