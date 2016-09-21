
const {Icon, Button} = require('react-mdl');

module.exports = function SnippetIndex(props) {
  const hasSnippets = (
    <div>
      You have <strong>{props.count}</strong> code snippet(s).<br/>
      Select them in left dropdown, edit and run or create new.
    </div>
  );

  const noSnippets = (
    <div>
      There are no code snippets yet.<br/>
      Feel free to create new one and start awesome testing!
    </div>
  );

  return (
    <div className="snippet-index">
      {props.count ? hasSnippets : noSnippets}
      <Button raised style={{marginTop: '25px'}}>
        <Icon name="add"/>
        <span className="button-text">Create new snippet</span>
      </Button>
    </div>
  );
};
