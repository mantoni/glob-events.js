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


describe('removeListener', function () {

  it('throws if first arg is null', function () {
    var e = new Emitter();

    assert.throws(function () {
      e.removeListener(null, util.noop());
    }, TypeError);
  });

  it('throws if second arg is null', function () {
    var e = new Emitter();

    assert.throws(function () {
      e.removeListener('a.b', null);
    }, TypeError);
  });

  it('removes the given listener', function () {
    var e = new Emitter();
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addListener('a.b', fn1);
    e.addListener('a.b', fn2);

    e.removeListener('a.b', fn1);

    assert.deepEqual(e.listeners('a.b'), [fn2]);
  });

  it('removes once listener', function () {
    var e = new Emitter();
    var f = util.stub();
    e.once('a', f);

    e.removeListener('a', f);
    e.emit('a');

    assert(!f.calls.length);
  });

  it('emits "removeListener" event', function () {
    var e = new Emitter();
    var s = util.stub();
    var f = util.noop();

    e.addListener('removeListener', s);
    e.addListener('a', f);
    e.removeListener('a', f);

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['a', f]);
  });

  it('emits "removeListener" event on custom internal emitter', function () {
    var i = new Emitter();
    var e = new Emitter({
      internalEmitter: i
    });
    var s = util.stub();
    var f = util.noop();

    i.addListener('removeListener', s);
    e.addListener('a', f);
    e.removeListener('a', f);

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['a', f]);
    assert.equal(s.calls[0].scope.emitter, i);
  });

  it('does not emit "removeListener" event to matchers', function () {
    var e = new Emitter();
    var s = util.stub();
    var f = util.noop();

    e.addListener('*', s);
    e.addListener('a', f);
    e.removeListener('a', f);

    assert.equal(s.calls.length, 0);
  });

  it('emits function added with once', function () {
    var e = new Emitter();
    var s = util.stub();
    var f = util.noop();
    e.addListener('removeListener', s);
    e.once('a', f);

    e.removeListener('a', f);

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['a', f]);
  });

  it('does not emit event if nothing found', function () {
    var e = new Emitter();
    var s = util.stub();
    e.addListener('removeListener', s);

    e.removeListener('unknown', util.noop());

    assert.equal(s.calls.length, 0);
  });

  it('does not remove other listener if nothing found', function () {
    var e = new Emitter();
    var s = util.stub();
    e.addListener('a', s);

    e.removeListener('a', util.noop());
    e.emit('a');

    assert.equal(s.calls.length, 1);
  });

  it('emits custom remove event', function () {
    var e = new Emitter({
      removeEvent : 'bye'
    });
    var s = util.stub();
    var f = util.noop();

    e.addListener('bye', s);
    e.addListener('a', f);
    e.removeListener('a', f);

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['a', f]);
  });

  it('emits custom remove event on custom internal emitter', function () {
    var i = new Emitter();
    var e = new Emitter({
      internalEmitter : i,
      removeEvent     : 'bye'
    });
    var s = util.stub();
    var f = util.noop();

    i.addListener('bye', s);
    e.addListener('a', f);
    e.removeListener('a', f);

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['a', f]);
    assert.equal(s.calls[0].scope.emitter, i);
  });

  it('invokes "removeListener" listener with correct scope', function () {
    var e = new Emitter();
    var l = util.stub();
    var f = util.noop();
    e.addListener('removeListener', l);

    e.addListener('a', f);
    e.removeListener('a', f);

    var s = l.calls[0].scope;
    assert.equal(s.event, 'removeListener');
    assert.deepEqual(s.args, ['a', f]);
  });

});
