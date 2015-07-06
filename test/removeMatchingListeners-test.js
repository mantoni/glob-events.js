/*
 * glob-events.js
 *
 * Copyright (c) 2015 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
/*globals describe, it, beforeEach*/
'use strict';

var assert = require('assert');
var Emitter = require('../lib/events').Emitter;
var util = require('./fixture/util');


describe('removeMatchingListeners', function () {
  var e;

  beforeEach(function () {
    e = new Emitter();
  });

  it('throws if called without args', function () {
    assert.throws(function () {
      e.removeMatchingListeners();
    }, Error);
  });

  it('removes the named listeners', function () {
    var b = util.noop();
    e.addListener('a', util.noop());
    e.addListener('a', util.noop());
    e.addListener('b', b);

    e.removeMatchingListeners('a');

    assert.deepEqual(e.listeners(), [b]);
  });

  it('removes the matching listeners', function () {
    var b = util.noop();
    e.addListener('**', util.noop());
    e.addListener('a.*', util.noop());
    e.addListener('a.b', util.noop());
    e.addListener('b.c', b);

    e.removeMatchingListeners('a.*');

    assert.deepEqual(e.listeners(), [b]);
  });

  it('emits "removeListener" for each named listener', function () {
    var x = util.noop();
    var a = util.noop();
    var b = util.noop();
    var s = util.stub();
    e.addListener('removeListener', s);
    e.addListener('**', x);
    e.addListener('a.*', a);
    e.addListener('a.b', b);
    e.addListener('b.c', util.noop());

    e.removeMatchingListeners('a.*');

    assert.equal(s.calls.length, 3);
    assert.deepEqual(s.calls[0].args, ['**', x]);
    assert.deepEqual(s.calls[1].args, ['a.*', a]);
    assert.deepEqual(s.calls[2].args, ['a.b', b]);
  });

  it('emits function added with once', function () {
    var s = util.stub();
    var f = util.stub();
    e.addListener('removeListener', s);
    e.once('a', f);

    e.removeMatchingListeners('a');

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['a', f]);
  });

  it('removes function added with once', function () {
    var s = util.stub();
    var f = util.stub();
    e.addListener('removeListener', s);
    e.once('a', f);

    e.removeMatchingListeners('a');
    e.emit('a');

    assert.equal(f.calls.length, 0);
  });

  it('emits custom remove event', function () {
    e = new Emitter({
      removeEvent : 'bye'
    });
    var x = util.noop();
    var a = util.noop();
    var b = util.noop();
    var s = util.stub();
    e.addListener('bye', s);
    e.addListener('**', x);
    e.addListener('a.*', a);
    e.addListener('a.b', b);
    e.addListener('b.c', util.noop());

    e.removeMatchingListeners('a.*');

    assert.equal(s.calls.length, 3);
    assert.deepEqual(s.calls[0].args, ['**', x]);
    assert.deepEqual(s.calls[1].args, ['a.*', a]);
    assert.deepEqual(s.calls[2].args, ['a.b', b]);
  });

});
