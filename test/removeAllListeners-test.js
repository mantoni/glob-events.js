/*
 * glob-events.js
 *
 * Copyright (c) 2014-2015 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
/*globals describe, it, beforeEach*/
'use strict';

var assert = require('assert');
var Emitter = require('../lib/events').Emitter;
var util = require('./fixture/util');


describe('removeAllListeners', function () {

  it('removes all listeners if called without args', function () {
    var e = new Emitter();
    e.addListener('a', util.noop());
    e.addListener('b.c', util.noop());

    e.removeAllListeners();

    assert.deepEqual(e.listeners(), []);
  });

  it('removes the named listeners', function () {
    var e = new Emitter();
    var b = util.noop();
    e.addListener('a', util.noop());
    e.addListener('a', util.noop());
    e.addListener('b', b);

    e.removeAllListeners('a');

    assert.deepEqual(e.listeners(), [b]);
  });

  it('removes only the exact matching listeners', function () {
    var e = new Emitter();
    var b = util.noop();
    e.addListener('a.*', util.noop());
    e.addListener('a.b', b);

    e.removeAllListeners('a.*');

    assert.deepEqual(e.listeners(), [b]);
  });

  it('emits "removeListener" for each named listener', function () {
    var e = new Emitter();
    var a = util.noop();
    var s = util.stub();
    e.addListener('removeListener', s);
    e.addListener('**', util.noop());
    e.addListener('a.*', a);
    e.addListener('a.b', util.noop());
    e.addListener('b.c', util.noop());

    e.removeAllListeners('a.*');

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['a.*', a]);
  });

  it('emits "removeListener" for all listeners', function () {
    var e = new Emitter();
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

  it('emits "removeListener" for all listeners on a custom internal emitter',
    function () {
      var i = new Emitter();
      var e = new Emitter({
        internalEmitter : i
      });
      var a = util.noop();
      var b = util.noop();
      var c = util.noop();
      var s = util.stub();
      i.addListener('removeListener', s);
      e.addListener('a.*', a);
      e.addListener('a.b', b);
      e.addListener('b.c', c);

      e.removeAllListeners();

      assert.equal(s.calls.length, 3);
      assert.deepEqual(s.calls[0].args, ['a.*', a]);
      assert.deepEqual(s.calls[1].args, ['a.b', b]);
      assert.deepEqual(s.calls[2].args, ['b.c', c]);
    });

  it('doea not emit "removeListener" on matchers', function () {
    var e = new Emitter();
    var s = util.stub();
    e.addListener('*', s);
    e.addListener('a', util.noop());

    e.removeAllListeners();

    assert.equal(s.calls.length, 0);
  });

  it('emits function added with once', function () {
    var e = new Emitter();
    var s = util.stub();
    var f = util.noop();
    e.addListener('removeListener', s);
    e.once('a', f);

    e.removeAllListeners('a');

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['a', f]);
  });

  it('emits custom remove event', function () {
    var e = new Emitter({
      removeEvent : 'bye'
    });
    var a = util.noop();
    var s = util.stub();
    e.addListener('bye', s);
    e.addListener('**', util.noop());
    e.addListener('a.*', a);
    e.addListener('a.b', util.noop());
    e.addListener('b.c', util.noop());

    e.removeAllListeners('a.*');

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['a.*', a]);
  });

});
