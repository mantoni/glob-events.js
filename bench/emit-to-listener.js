/*
 * glob-events.js
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var bench  = require('bench');
var events = require('../lib/events');

var emitter = new events.Emitter();

emitter.addListener('test.one', function () { return; });
emitter.addListener('test.one', function () { return; });


exports.compare = {

  'emit(test.one)': function () {
    emitter.emit('test.one');
  },

  'emit(test.*)': function () {
    emitter.emit('test.*');
  },

  'emit(*.one)': function () {
    emitter.emit('*.one');
  },

  'emit(**)': function () {
    emitter.emit('**');
  }

};

bench.runMain();
