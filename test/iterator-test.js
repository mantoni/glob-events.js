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
var util = require('./fixture/util');


describe('iterator', function () {
  var e;

  beforeEach(function () {
    e = new Emitter();
  });

  it('returns an empty iterator by default', function () {
    var i = e.iterator();

    assert.strictEqual(i.next(), undefined);
  });

  it('returns previously added listeners', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addListener('a', fn1);
    e.addListener('b.c', fn2);

    var i = e.iterator();

    assert.deepEqual(i.toArray(), [
      { event : 'a', fn : fn1 },
      { event : 'b.c', fn : fn2 }
    ]);
  });

  it('returns matching listeners', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addListener('*', fn1);
    e.addListener('b', fn2);

    var i = e.iterator('*');

    assert.deepEqual(i.toArray(), [
      { event : '*', fn : fn1 },
      { event : 'b', fn : fn2 }
    ]);
  });

  it('allows to exclude listeners', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addListener('*', fn1);
    e.addListener('b', fn2);

    var i = e.iterator('*', {
      listeners : false
    });

    assert.deepEqual(i.toArray(), [{ event : '*', fn : fn1 }]);
  });

  it('returns matchers', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addListener('**', fn1);
    e.addListener('a.*', fn2);

    var i = e.iterator('a.b');

    assert.deepEqual(i.toArray(), [
      { event : '**', fn : fn1 },
      { event : 'a.*', fn : fn2 }
    ]);
  });

  it('allows to exclude matchers', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addListener('**', fn1);
    e.addListener('a.*', fn2);

    var i = e.iterator('a.b', {
      matchers : false
    });

    assert.deepEqual(i.toArray(), []);
  });

  it('still includes exact match if matchers are excluded', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addListener('*', fn1);
    e.addListener('b', fn2);

    var i = e.iterator('*', {
      matchers : false
    });

    assert.deepEqual(i.toArray(), [{ event : 'b', fn : fn2 }]);
  });

  it('stores event name of once listener', function () {
    var f = util.noop();
    e.once('a', f);

    var i = e.iterator();

    assert.equal(i.toArray()[0].event, 'a');
  });

  it('does not return original once listener', function () {
    var f = util.noop();
    e.once('a', f);

    var i = e.iterator();

    assert.notStrictEqual(i.toArray()[0].fn, f);
  });

  it('returned function for once listener invokes original', function () {
    var f = util.stub();
    e.once('a', f);

    var i = e.iterator();
    i.next().fn();

    assert.equal(f.calls.length, 1);
  });

  it('handles options as the only argument correctly', function () {
    var f = util.noop();
    e.addListener('*', f);

    var i = e.iterator({ matchers : false });

    assert.deepEqual(i.toArray(), []);
  });

  it('does not return matchers for event name "error"', function () {
    var f = util.noop();
    e.addListener('*', f);

    var i = e.iterator('error');

    assert.deepEqual(i.toArray(), []);
  });

});
