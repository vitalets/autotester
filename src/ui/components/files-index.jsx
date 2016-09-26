
module.exports = function FilesIndex(props) {
  const has = (
    <div>
      You have loaded <strong>{props.count}</strong> test{props.count === 1 ? '' : 's'} from URL:<br/>
      <a href={props.url}>{props.url}</a><br/><br/>
      Select tests in left dropdown and run all or separately.
    </div>
  );

  const no = (
    <div>
      There are no tests loaded.<br/>
      Please check URL in settings.
    </div>
  );

  return (
    <div className="tests-index">
      {props.count ? has : no}
    </div>
  );
};
