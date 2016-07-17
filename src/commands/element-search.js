/**
 * Commands to search element on page
 */


function find() {
  // this._currentTarget.debugger
  // this._currentTarget.rootNodeId
  // resolve parent nodeId
  // querySelector


case command.Name.FIND_ELEMENT:
  const selector = cmd.getParameter('value');
  return this._debugger.sendCommand('DOM.getDocument', {})
    .then(res => {
      console.log('getDocument', res);
      return this._debugger.sendCommand('DOM.querySelector', {
        nodeId: res.root.nodeId,
        selector: selector
      });
    })
    .then(node => {
      console.log('querySelector', node);
      if (!node.nodeId) {
        return Promise.reject(`Element not found by ${selector}`);
      }
      return webdriver.WebElement.buildId(String(node.nodeId));
    });
  break;
}
