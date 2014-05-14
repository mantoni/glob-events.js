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


describe('emit', function () {
  var e;

  beforeEach(function () {
    e = new Emitter();
  });

  it('throws if first arg is null', function () {
    assert.throws(function () {
      e.emit(null);
    }, TypeError);
  });

  it('invokes listeners with args', function () {
    var l1 = util.stub();
    var l2 = util.stub();
    e.addListener('a', l1);
    e.addListener('a', l2);

    e.emit('a', 42, { x : 1 }, ['y']);

    assert.equal(l1.calls.length, 1);
    assert.equal(l2.calls.length, 1);
    assert.deepEqual(l1.calls[0].args, [42, { x : 1 }, ['y']]);
    assert.deepEqual(l2.calls[0].args, [42, { x : 1 }, ['y']]);
  });

  it('invokes matching listeners', function () {
    var l1 = util.stub();
    var l2 = util.stub();
    e.addListener('a.b', l1);
    e.addListener('a.c', l2);

    e.emit('a.*');

    assert.equal(l1.calls.length, 1);
    assert.equal(l2.calls.length, 1);
  });

  it('does not invoke non-matching listeners', function () {
    var l1 = util.stub();
    var l2 = util.stub();
    e.addListener('b.a', l1);
    e.addListener('a.b.c', l2);

    e.emit('a.*');

    assert.equal(l1.calls.length, 0);
    assert.equal(l2.calls.length, 0);
  });

  it('invokes matchers', function () {
    var l1 = util.stub();
    var l2 = util.stub();
    e.addListener('**', l1);
    e.addListener('a.*', l2);

    e.emit('a.b');

    assert.equal(l1.calls.length, 1);
    assert.equal(l2.calls.length, 1);
  });

  it('accepts config object with event', function () {
    var l1 = util.stub();
    var l2 = util.stub();
    e.addListener('*', l1);
    e.addListener('a', l2);

    assert.doesNotThrow(function () {
      e.emit({ event : 'a' });
    });
    assert.equal(l1.calls.length, 1);
    assert.equal(l2.calls.length, 1);
  });

  it('throws if config object is empty', function () {
    assert.throws(function () {
      e.emit({});
    }, TypeError);
  });

  it('allows to exclude matchers', function () {
    var l1 = util.stub();
    var l2 = util.stub();
    e.addListener('*', l1);
    e.addListener('a', l2);

    e.emit({ event : 'a', matchers : false });

    assert.equal(l1.calls.length, 0);
    assert.equal(l2.calls.length, 1);
  });

  it('allows to exclude listeners', function () {
    var l1 = util.stub();
    var l2 = util.stub();
    e.addListener('*', l1);
    e.addListener('a', l2);

    e.emit({ event : 'a', listeners : false });

    assert.equal(l1.calls.length, 1);
    assert.equal(l2.calls.length, 0);
  });

  it('exposes event in scope', function () {
    var l = util.stub();
    e.addListener('a', l);

    e.emit('a');

    assert.equal(l.calls[0].scope.event, 'a');
  });

  it('exposes args in scope', function () {
    var l = util.stub();
    e.addListener('a', l);

    e.emit('a', 42, [], null, 'str');

    assert.deepEqual(l.calls[0].scope.args, [42, [], null, 'str']);
  });

  it('defaults args to empty array', function () {
    var l = util.stub();
    e.addListener('a', l);

    e.emit('a');

    assert.deepEqual(l.calls[0].scope.args, []);
  });

  it('exposes opts in scope', function () {
    var l = util.stub();
    e.addListener('a', l);

    e.emit({
      event     : 'a',
      matchers  : true,
      listeners : true
    });

    assert(l.calls[0].scope.matchers);
    assert(l.calls[0].scope.listeners);
  });

  it('does not define undefined opts', function () {
    var l = util.stub();
    e.addListener('a', l);

    e.emit({
      event : 'a'
    });

    assert.strictEqual(l.calls[0].scope.matchers, undefined);
    assert.strictEqual(l.calls[0].scope.listeners, undefined);
  });

  it('passes on custom properties on scope', function () {
    var l = util.stub();
    e.addListener('a', l);

    e.emit({
      event  : 'a',
      answer : 42
    });

    assert.equal(l.calls[0].scope.answer, 42);
  });

  it('invokes once listener with scope', function () {
    var l = util.stub();
    e.once('a', l);

    e.emit('a');

    assert.equal(l.calls[0].scope.event, 'a');
  });

});
