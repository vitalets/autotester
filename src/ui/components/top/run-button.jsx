
const {Button} = require('react-mdl');
const {onTestsRun} = require('../../controllers/internal-channels');

module.exports = class RunButton extends React.Component {
  render() {
    return (
      <Button id="run" raised accent ripple onClick={() => onTestsRun.dispatch()}>Run</Button>
    );
  }
};
