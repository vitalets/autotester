
const mouse = require('./mouse');

function clickElement(params) {
  const el = getElement()
  const coords = getCoords();
  mouse.click(coords);

}

case command.Name.CLICK_ELEMENT:
return thenChrome.debugger.sendCommand(data.target, 'DOM.getBoxModel', {
    nodeId: Number(cmd.getParameter('id'))
  })
  .then(res => {
    const content = res.model.content;
    const centerX = content[0] + Math.round((content[2] - content[0]) / 2);
    const centerY = content[3] + Math.round((content[5] - content[3]) / 2);
    // todo: mousemove
    return thenChrome.debugger.sendCommand(data.target, 'Input.dispatchMouseEvent', {
        "button": "left",
        "clickCount": 1,
        "modifiers": 0,
        "type": "mousePressed",
        "x": centerX,
        "y": centerY
      })
      .then(() => thenChrome.debugger.sendCommand(data.target, 'Input.dispatchMouseEvent', {
        "button": "left",
        "clickCount": 1,
        "modifiers": 0,
        "type": "mouseReleased",
        "x": centerX,
        "y": centerY
      }));
  })

break;


case command.Name.SEND_KEYS_TO_ELEMENT:
// todo: scroll
// todo: rawKeyPress
return thenChrome.debugger.sendCommand(data.target, 'DOM.focus', {
    nodeId: Number(cmd.getParameter('id'))
  })
  .then(() => {
    return thenChrome.debugger.sendCommand(data.target, 'Input.dispatchKeyEvent', {
      "modifiers": 0,
      "nativeVirtualKeyCode": 0,
      "text": "w",
      "type": "char",
      "unmodifiedText": "w",
      "windowsVirtualKeyCode": 0
    });
  })
  .then(() => {
    return thenChrome.debugger.sendCommand(data.target, 'Input.dispatchKeyEvent', {
      "modifiers": 0,
      "nativeVirtualKeyCode": 0,
      "text": "e",
      "type": "char",
      "unmodifiedText": "e",
      "windowsVirtualKeyCode": 0
    });
  })
break;
