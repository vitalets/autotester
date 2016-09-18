const {observer} = require('mobx-react');

module.exports = observer(function ContentSettings() {
  return (
    <div>

      <h4>Tests source</h4>
      {/*
      <div>
        <label>
          <input type="radio" name="testSource" value="snippets"/>
          Snippets
        </label>
        <label>
          <input type="radio" name="testSource" value="url"/>
          <span>URL</span>
          <input type="text" style="width: 200px"/>
        </label>
        <label>
          <input type="radio" name="testSource" value="extension"/>
          Extension-self
        </label>
      </div>
*/}
      <div>
        <button id="btn-save-settings">Save</button>
      </div>

    </div>
  );
});
