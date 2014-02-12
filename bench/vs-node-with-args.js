/*
 * glob-events.js
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var bench        = require('bench');
var Emitter      = require('../lib/events').Emitter;
var EventEmitter = require('events').EventEmitter;

var emitter = new Emitter();
var node    = new EventEmitter();

emitter.addListener('test', function () { return; });
emitter.addListener('test', function () { return; });
node.addListener('test', function () { return; });
node.addListener('test', function () { return; });


exports.compare = {

  'emitter': function () {
    emitter.emit('test', 42, 'abc', true);
  },

  'node': function () {
    node.emit('test', 42, 'abc', true);
  }

};

bench.runMain();
