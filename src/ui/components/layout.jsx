
const Header = require('./header');
const Main = require('./main');

// (props) => <div>Hello {props.name}</div>

module.exports = class Layout extends React.Component {
    render() {
        return (
            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                <Header/>
                <Main/>
            </div>
        );
    }
};
