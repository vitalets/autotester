
const {Icon, Button} = require('react-mdl');
const store = require('../store').store;
const FlagsNote = require('./flags-note');

module.exports = function SnippetIndex(props) {
  const has = (
    <div>
      You have <strong>{props.count}</strong> test{props.count === 1 ? '' : 's'}!<br/>
      Select tests in left dropdown, edit and run.<br/><br/>
      OR
    </div>
  );

  const no = (
    <div>
      There are no tests yet<br/>
      Feel free to create new one and start awesome testing!
    </div>
  );

  return (
    <div className="tests-index">
      {props.count ? has : no}
      <Button raised style={{marginTop: '25px'}} onClick={() => store.addSnippet()}>
        <Icon name="add"/>
        <span className="button-text">Create new test</span>
      </Button>
      <FlagsNote/>
    </div>
  );
};
