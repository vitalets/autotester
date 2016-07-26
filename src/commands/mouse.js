/**
 * Mouse commands
 * Element coordinates are relative to scrolled position.
 * Mouse coordinates are relative to scrolled position.
 * If coordinates are out of viewport - events will not be dispatched.
 */

const seleniumCommand = require('selenium-webdriver/lib/command');
const input = require('selenium-webdriver/lib/input');
const TargetManager = require('../target-manager');
const modifiers = require('./keyboard/modifiers');

exports.commands = {
  [seleniumCommand.Name.CLICK_ELEMENT]: clickElement,
  [seleniumCommand.Name.CLICK]: click,
  [seleniumCommand.Name.DOUBLE_CLICK]: doubleClick,
  [seleniumCommand.Name.MOVE_TO]: moveTo,
};

// map selenium buttons to debugger buttons
const BUTTONS = {
  [input.Button.LEFT]: 'left',
  [input.Button.MIDDLE]: 'middle',
  [input.Button.RIGHT]: 'right',
};

// store last moveTo coords as selenium does not send it in 'click' command
let lastMoveTo = {
  x: 0,
  y: 0,
};

function clickElement(params) {
  return getElementCenter(params.id)
    .then(center => {
      return Promise.resolve()
        .then(() => scrollToXY(center.x, center.y))
        .then(() => new Promise(r => setTimeout(r, 1000)))
        .then(() => getElementCenter(params.id))
        .then(center => {
          return Promise.resolve()
            .then(() => moveToXY(center.x, center.y))
            .then(() => clickXY(center.x, center.y));
        })

    });
}

/**
 * Click particular button on current location
 *
 * @param {Object} params
 * @param {Number} params.button
 * @returns {Promise}
 */
function click(params) {
  const button = BUTTONS[params.button];
  return clickXY(lastMoveTo.x, lastMoveTo.y, button);
}

function doubleClick(params) {
  const button = BUTTONS[params.button];
  return clickXY(lastMoveTo.x, lastMoveTo.y, button, 2);
}

function moveTo(params) {
  // todo: opt_offset
  const position =  params.element
    ? getElementCenter(params.element)
    : Promise.resolve({x: params.x, y: params.y});
  return position
    .then(p => moveToXY(p.x, p.y));
}

// === internal ===

function clickXY(x, y, button = 'left', count = 1) {
  return Promise.resolve()
    .then(() => buttonAction(x, y, 'mousePressed', button, count))
    .then(() => buttonAction(x, y, 'mouseReleased', button, count));
}

function moveToXY(x, y) {
  return dispatchMouseEvent({
    button: 'none',
    clickCount: 0,
    type: 'mouseMoved',
    x: x,
    y: y
  })
  .then(() => lastMoveTo = {x, y});
}

function buttonAction(x, y, type, button, count) {
  return dispatchMouseEvent({
    button: button,
    clickCount: count,
    type: type,
    x: x,
    y: y
  });
}

function dispatchMouseEvent(options) {
  options.modifiers = modifiers.get();
  return TargetManager.debugger.sendCommand('Input.dispatchMouseEvent', options);
}

function getElementCenter(id) {
  return TargetManager.debugger.sendCommand('DOM.getBoxModel', {
      nodeId: Number(id)
    })
    .then(res => {
      const content = res.model.content;
      // calc click point as center of element
      const x = content[0] + Math.round((content[2] - content[0]) / 2);
      const y = content[3] + Math.round((content[5] - content[3]) / 2);
      highlightXY(x, y);
      return {x, y};
    });
}

// function to scroll
// temp as it can be used in several other commands
function scrollToXY(x, y) {
  return TargetManager.debugger.sendCommand('Runtime.evaluate', {
    expression: `window.scrollTo(${x}, ${y})`
  });
}

function highlightXY(x, y) {
  return TargetManager.debugger.sendCommand('DOM.highlightRect', {
    x: x - 10,
    y: y - 10,
    width: 20,
    height: 20,
    color: {r: 255, g: 0, b: 0, a: 1}
  });
}
