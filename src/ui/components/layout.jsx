
const {observer} = require('mobx-react');
const Title = require('./title');
const Header = require('./header');
const Tabs = require('./tabs');
const Main = require('./main');

module.exports = observer(function Layout() {
  return (
    <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <Title/>
      <Header/>
      <Tabs/>
      <Main/>
    </div>
  );
});
