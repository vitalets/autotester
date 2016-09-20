const {observer} = require('mobx-react');
const {Layout} = require('react-mdl');
const Title = require('./title');
const Top = require('./top');
const TabBar = require('./tab-bar');
const Center = require('./center');
const Dropdown = require('./dropdown');
const store = require('../store').store;

module.exports = observer(function App() {
  return (
    <Layout fixedHeader>
      <Title/>
      <Top/>
      <TabBar/>
      {/*<Main/>*/}
    </Layout>
  );
});


