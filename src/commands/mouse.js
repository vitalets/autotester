/**
 * Mouse commands
 * All coordinates are relative to scrolled position (viewport).
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
  return Promise.resolve()
     // .then(() => getScrollXY())
    // scroll to top for correct coords
    // todo: check element is visible!
    .then(() => scrollToXY(0, 0))
    .then(() => getElementCenter(params.id))
    .then(center => scrollToXY(center.x, center.y))
    .then(() => getElementCenter(params.id))
    //.then(() => new Promise(r => setTimeout(r, 1000)))
    .then(center => moveAndClickXY(center.x, center.y));
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

function moveAndClickXY(x, y) {
  return Promise.resolve()
    .then(() => moveToXY(x, y))
    .then(() => clickXY(x, y));
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
      const center = getQuadCenter(res.model.content);
      highlightXY(center.x, center.y);
      return center;
    });
}

function getQuadCenter(quad) {
  return {
    x: quad[0] + Math.round((quad[2] - quad[0]) / 2),
    y: quad[3] + Math.round((quad[5] - quad[3]) / 2),
  };
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

function getScrollXY() {
  return TargetManager.debugger.sendCommand('Runtime.evaluate', {
    // expression: `(function() {return {y: window.scrollY}}())`
    expression: `window.scrollY`
  });
}
