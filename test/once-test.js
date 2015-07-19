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


describe('once', function () {

  it('throws if first arg is null', function () {
    var e = new Emitter();

    assert.throws(function () {
      e.once(null);
    }, TypeError);
  });

  it('throws if second arg is not a function', function () {
    var e = new Emitter();

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
    var e = new Emitter();
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
    var e = new Emitter();
    var args;
    e.once('such', function () {
      args = Array.prototype.slice.call(arguments);
    });

    e.emit('such', 'args', { much : 'wow' });

    assert.deepEqual(args, ['args', { much : 'wow' }]);
  });

  it('emits "newListener" event', function () {
    var e = new Emitter();
    var s = util.stub();
    var f = util.noop();

    e.addListener('newListener', s);
    e.once('a', f);

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['a', f]);
  });

  it('emits "newListener" event on custom internal emitter', function () {
    var i = new Emitter();
    var e = new Emitter({
      internalEmitter : i
    });
    var s = util.stub();
    var f = util.noop();

    i.addListener('newListener', s);
    e.once('a', f);

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['a', f]);
  });

  it('does not emit "newListener" event to matchers', function () {
    var e = new Emitter();
    var s = util.stub();

    e.addListener('*', s);
    e.once('a', util.noop());

    assert.equal(s.calls.length, 0);
  });

  it('allows first argument to be object with event property', function () {
    var e = new Emitter();

    assert.doesNotThrow(function () {
      e.once({ event : 'a' }, util.noop());
    });
  });

  it('emits "newListener" event if configured with object', function () {
    var e = new Emitter();
    var s = util.stub();
    var f = util.noop();

    e.addListener('newListener', s);
    e.once({ event : 'a' }, f);

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['a', f]);
  });

  it("does not change arity of added listener", function () {
    var e = new Emitter();
    e.once('a', function (a, b, c) {
      /*jslint unparam: true*/
      return;
    });

    var l = e.iterator('a').next().fn;

    assert.equal(l.length, 3);
    l(); // coverage
  });

});
