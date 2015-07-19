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


describe('addListener', function () {

  it('throws if first arg is null', function () {
    var e = new Emitter();

    assert.throws(function () {
      e.addListener(null);
    }, TypeError);
  });

  it('throws if second arg is not a function', function () {
    var e = new Emitter();

    assert.throws(function () {
      e.addListener('a.b', null);
    }, TypeError);
    assert.throws(function () {
      e.addListener('a.b', {});
    }, TypeError);
    assert.throws(function () {
      e.addListener('a.b', /[a-z]/);
    }, TypeError);
  });

  it('is also called "on"', function () {
    assert.strictEqual(Emitter.prototype.on, Emitter.prototype.addListener);
  });

  it('emits "newListener" event', function () {
    var e = new Emitter();
    var s = util.stub();
    var f = util.noop();

    e.addListener('newListener', s);
    e.addListener('a', f);

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['a', f]);
  });

  it('emits "newListener" event on custom internal emitter', function () {
    var i = new Emitter();
    var e = new Emitter({
      internalEmitter: i
    });
    var s = util.stub();
    var f = util.noop();

    i.addListener('newListener', s);
    e.addListener('a', f);

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['a', f]);
    assert.equal(s.calls[0].scope.emitter, i);
  });

  it('does not emit "newListener" event to matchers', function () {
    var e = new Emitter();
    var s = util.stub();

    e.addListener('*', s);
    e.addListener('a', util.noop());

    assert.equal(s.calls.length, 0);
  });

  it('allows first argument to be object with event property', function () {
    var e = new Emitter();

    assert.doesNotThrow(function () {
      e.addListener({ event : 'a' }, util.noop());
    });
  });

  it('emits "newListener" event if configured with object', function () {
    var e = new Emitter();
    var s = util.stub();
    var f = util.noop();

    e.addListener('newListener', s);
    e.addListener({ event : 'a' }, f);

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['a', f]);
  });

  it('emits custom add event', function () {
    var e = new Emitter({
      addEvent : 'welcome'
    });
    var s = util.stub();
    var f = util.noop();

    e.addListener('welcome', s);
    e.addListener('a', f);

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['a', f]);
  });

  it('emits custom add event on custom internal emitter', function () {
    var i = new Emitter();
    var e = new Emitter({
      internalEmitter : i,
      addEvent        : 'welcome'
    });
    var s = util.stub();
    var f = util.noop();

    i.addListener('welcome', s);
    e.addListener('a', f);

    assert.equal(s.calls.length, 1);
    assert.deepEqual(s.calls[0].args, ['a', f]);
    assert.equal(s.calls[0].scope.emitter, i);
  });

  it('invokes "newListener" listener with correct scope', function () {
    var e = new Emitter();
    var l = util.stub();
    var f = util.noop();
    e.addListener('newListener', l);

    e.addListener('a', f);

    var s = l.calls[0].scope;
    assert.equal(s.event, 'newListener');
    assert.deepEqual(s.args, ['a', f]);
  });

  it('does not change arity of "newListener" listener', function () {
    var e = new Emitter();
    e.addListener('newListener', function (a, b, c) {
      /*jslint unparam: true*/
      return;
    });

    var l = e.iterator('newListener').next().fn;

    assert.equal(l.length, 3);
    l.call({}); // coverage
  });

});
