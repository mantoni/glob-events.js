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


function noop() {
  return function () { return; };
}
noop()();


describe('listeners', function () {
  var e;

  beforeEach(function () {
    e = new Emitter();
  });

  it('returns an empty array by default', function () {
    var a = e.listeners();

    assert.deepEqual(a, []);
  });

  it('returns previously added listeners', function () {
    var fn1 = noop();
    var fn2 = noop();
    e.addListener('a', fn1);
    e.addListener('b.c', fn2);

    var a = e.listeners();

    assert.deepEqual(a, [fn1, fn2]);
  });

  it('returns matching listeners', function () {
    var fn1 = noop();
    var fn2 = noop();
    e.addListener('*', fn1);
    e.addListener('b', fn2);

    var a = e.listeners('*');

    assert.deepEqual(a, [fn1, fn2]);
  });

  it('allows to exclude listeners', function () {
    var fn1 = noop();
    var fn2 = noop();
    e.addListener('*', fn1);
    e.addListener('b', fn2);

    var a = e.listeners('*', {
      listeners : false
    });

    assert.deepEqual(a, [fn1]);
  });

  it('returns matchers', function () {
    var fn1 = noop();
    var fn2 = noop();
    e.addListener('**', fn1);
    e.addListener('a.*', fn2);

    var a = e.listeners('a.b');

    assert.deepEqual(a, [fn1, fn2]);
  });

  it('allows to exclude matchers', function () {
    var fn1 = noop();
    var fn2 = noop();
    e.addListener('**', fn1);
    e.addListener('a.*', fn2);

    var a = e.listeners('a.b', {
      matchers : false
    });

    assert.deepEqual(a, []);
  });

  it('still includes exact match if matchers are excluded', function () {
    var fn1 = noop();
    var fn2 = noop();
    e.addListener('*', fn1);
    e.addListener('b', fn2);

    var a = e.listeners('*', {
      matchers : false
    });

    assert.deepEqual(a, [fn2]);
  });

  it('returns original once listener', function () {
    var f = noop();
    e.once('a', f);

    var a = e.listeners();

    assert.deepEqual(a, [f]);
  });

});
