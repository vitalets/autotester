/**
 * Events from selenium control flow
 */

const Channel = require('chnl');
//const promise = require('selenium-webdriver/lib/promise');

// const {IDLE, UNCAUGHT_EXCEPTION} = promise.ControlFlow.EventType;

exports.onError = new Channel();
exports.onIdle = new Channel();
exports.onErrorOrIdle = new Channel();

/*
 _listenFlowEvents() {
 this._flow.on(IDLE, () => super.stop());
 this._flow.on(UNCAUGHT_EXCEPTION, () => super.stop());
 }
 */
