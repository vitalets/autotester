
module.exports = props => {
    return <button
        style={props.style}
        className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
        {props.children}
    </button>
};
