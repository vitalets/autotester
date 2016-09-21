
const {Icon, Button} = require('react-mdl');

module.exports = function SnippetIndex(props) {
  const has = (
    <div>
      You have <strong>{props.count}</strong> tests(s)<br/>
      Select them in dropdown, edit and run or create new
    </div>
  );

  const no = (
    <div>
      There are no tests yet<br/>
      Feel free to create new one and start awesome testing!
    </div>
  );

  return (
    <div className="snippet-index">
      {props.count ? has : no}
      <Button raised style={{marginTop: '25px'}}>
        <Icon name="add"/>
        <span className="button-text">Create new test</span>
      </Button>
    </div>
  );
};
