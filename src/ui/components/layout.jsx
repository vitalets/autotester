
const {observer} = require('mobx-react');
const Header = require('./header');
const Tabs = require('./tabs');
const Main = require('./main');

module.exports = observer(function Layout() {
  return (
    <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <Header/>
      <Tabs/>
      <Main/>
    </div>
  );
});
