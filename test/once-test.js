/*
 * glob-events.js
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
/*globals describe, it, beforeEach*/
'use strict';

var assert = require('assert');
var Emitter = require('../lib/events').Emitter;


describe('once', function () {
  var e;

  beforeEach(function () {
    e = new Emitter();
  });

  it('throws if first arg is null', function () {
    assert.throws(function () {
      e.once(null);
    }, TypeError);
  });

  it('throws if second arg is not a function', function () {
    assert.throws(function () {
      e.once('a.b', null);
    }, TypeError);
    assert.throws(function () {
      e.once('a.b', {});
    }, TypeError);
    assert.throws(function () {
      e.once('a.b', /[a-z]/);
    }, TypeError);
  });

  it('invokes listener on first emit', function () {
    var called = 0;
    e.once('a', function () {
      called++;
    });

    e.emit('a');
    e.emit('a');
    e.emit('a');

    assert.equal(called, 1);
  });

  it('passes arguments', function () {
    var args;
    e.once('such', function () {
      args = Array.prototype.slice.call(arguments);
    });

    e.emit('such', 'args', { much : 'wow' });

    assert.deepEqual(args, ['args', { much : 'wow' }]);
  });

});
