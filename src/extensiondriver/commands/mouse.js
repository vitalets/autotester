/**
 * Mouse commands
 * All coordinates are relative to scrolled position (viewport).
 * If coordinates are out of viewport - events will not be dispatched.
 */

const input = require('selenium-webdriver/lib/input');
const Targets = require('../targets');
const modifiers = require('./keyboard/modifiers');

// map selenium buttons to debugger buttons
const BUTTONS = {
  [input.Button.LEFT]: 'left',
  [input.Button.MIDDLE]: 'middle',
  [input.Button.RIGHT]: 'right',
};

// store last moveTo coords as selenium does not send it in 'click' command
const lastMoveTo = {
  x: 0,
  y: 0,
};

exports.clickElement = function (params) {
  return Promise.resolve()
     // .then(() => getScrollXY())
    // temp: scroll to top for correct coords
    // todo: scroll to element in center layout
    // todo: check element is visible!
    // see also: getNodeForLocation
    .then(() => scrollToXY(0, 0))
    .then(() => getElementCenter(params.id))
    .then(center => scrollToXY(center.x, center.y))
    .then(() => getElementCenter(params.id))
    //.then(() => new Promise(r => setTimeout(r, 1000)))
    .then(center => {
      return Promise.resolve()
        .then(() => moveAndClickXY(center.x, center.y))
        // .then(() => highlightClick(center.x, center.y))
    });
};

/**
 * Click particular button on current location
 *
 * @param {Object} params
 * @param {Number} params.button
 * @returns {Promise}
 */
exports.click = function (params) {
  const button = BUTTONS[params.button];
  return clickXY(lastMoveTo.x, lastMoveTo.y, button);
};

exports.doubleClick = function (params) {
  const button = BUTTONS[params.button];
  return clickXY(lastMoveTo.x, lastMoveTo.y, button, 2);
};

exports.moveTo = function (params) {
  // todo: opt_offset
  const position =  params.element
    ? getElementCenter(params.element)
    : Promise.resolve({x: params.x, y: params.y});
  return position
    .then(p => moveToXY(p.x, p.y));
};

// todo: Point class

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
  .then(() => Object.assign(lastMoveTo, {x, y}));
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
  return Targets.debugger.sendCommand('Input.dispatchMouseEvent', options);
}

function getElementCenter(id) {
  return Targets.debugger.sendCommand('DOM.getBoxModel', {
      nodeId: Number(id)
    })
    .then(res => getQuadCenter(res.model.content));
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
  return Targets.debugger.sendCommand('Runtime.evaluate', {
    expression: `window.scrollTo(${x}, ${y})`
  });
}

function highlightXY(x, y, frame) {
  const size = Math.round(5 + 50 * frame);
  return Targets.debugger.sendCommand('DOM.highlightRect', {
    x: x - Math.round(size / 2),
    y: y - Math.round(size / 2),
    width: size,
    height: size,
    color: {r: Math.round(255 * (1 - frame)), g: 0, b: 0, a: 1 - frame}
  });
}

function highlightClick(x, y) {
  const duration = 500;
  const interval = 40; // 25 frames per second
  const framesCount = Math.ceil(duration / interval);
  const frames = []; res = Promise.resolve();
  for (let i = 0; i <= framesCount; i++) {
    frames.push(i / framesCount);
  }
  return frames.reduce((res, frame) => {
    return res
      .then(() => highlightXY(x, y, frame))
      .then(() => new Promise(resolve => setTimeout(resolve, interval)))
  }, Promise.resolve());

}

function getScrollXY() {
  return Targets.debugger.sendCommand('Runtime.evaluate', {
    // expression: `(function() {return {y: window.scrollY}}())`
    expression: `window.scrollY`
  });
}
