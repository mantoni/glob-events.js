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
var util = require('./util');


describe('removeAllListeners', function () {
  var e;

  beforeEach(function () {
    e = new Emitter();
  });

  it('removes all listeners if called without args', function () {
    e.addListener('a', util.noop());
    e.addListener('b.c', util.noop());

    e.removeAllListeners();

    assert.deepEqual(e.listeners(), []);
  });

  it('removes the named listeners', function () {
    var b = util.noop();
    e.addListener('a', util.noop());
    e.addListener('a', util.noop());
    e.addListener('b', b);

    e.removeAllListeners('a');

    assert.deepEqual(e.listeners(), [b]);
  });

  it('removes only the exact matching listeners', function () {
    var b = util.noop();
    e.addListener('a.*', util.noop());
    e.addListener('a.b', b);

    e.removeAllListeners('a.*');

    assert.deepEqual(e.listeners(), [b]);
  });

  it('emits "removeListener" for each named listener', function () {
    var a = util.noop();
    var b = util.noop();
    var s = util.stub();

    e.addListener('removeListener', s);
    e.addListener('a.*', a);
    e.addListener('a.b', b);
    e.addListener('b.c', util.noop());

    e.removeAllListeners('a.*');

    assert.equal(s.calls.length, 2);
    assert.deepEqual(s.calls[0].args, ['a.*', a]);
    assert.deepEqual(s.calls[1].args, ['a.b', b]);
  });

  it('emits "removeListener" for all listeners', function () {
    var a = util.noop();
    var b = util.noop();
    var c = util.noop();
    var s = util.stub();

    e.addListener('removeListener', s);
    e.addListener('a.*', a);
    e.addListener('a.b', b);
    e.addListener('b.c', c);

    e.removeAllListeners();

    assert.equal(s.calls.length, 4);
    assert.deepEqual(s.calls[0].args, ['removeListener', s]);
    assert.deepEqual(s.calls[1].args, ['a.*', a]);
    assert.deepEqual(s.calls[2].args, ['a.b', b]);
    assert.deepEqual(s.calls[3].args, ['b.c', c]);
  });

  it('doea not emit "removeListener" on matchers', function () {
    var s = util.stub();
    e.addListener('*', s);
    e.addListener('a', util.noop());

    e.removeAllListeners();

    assert.equal(s.calls.length, 0);
  });

});
