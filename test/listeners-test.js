/*
 * glob-events.js
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
/*globals describe, it*/
'use strict';

var assert = require('assert');
var Emitter = require('../lib/events').Emitter;


function noop() {
  return function () { return; };
}
noop()();


describe('listeners', function () {

  it('returns an empty array by default', function () {
    var e = new Emitter();

    var a = e.listeners();

    assert.deepEqual(a, []);
  });

  it('returns previously added listeners', function () {
    var e   = new Emitter();
    var fn1 = noop();
    var fn2 = noop();
    e.addListener('a', fn1);
    e.addListener('b.c', fn2);

    var a = e.listeners();

    assert.deepEqual(a, [fn1, fn2]);
  });

  it('returns matching listeners', function () {
    var e   = new Emitter();
    var fn1 = noop();
    var fn2 = noop();
    e.addListener('*', fn1);
    e.addListener('b', fn2);

    var a = e.listeners('*');

    assert.deepEqual(a, [fn1, fn2]);
  });

  it('allows to exclude matchers', function () {
    var e   = new Emitter();
    var fn1 = noop();
    var fn2 = noop();
    e.addListener('*', fn1);
    e.addListener('b', fn2);

    var a = e.listeners('*', {
      matchers : false
    });

    assert.deepEqual(a, [fn2]);
  });

  it('allows to only include matchers', function () {
    var e   = new Emitter();
    var fn1 = noop();
    var fn2 = noop();
    e.addListener('*', fn1);
    e.addListener('b', fn2);

    var a = e.listeners('*', {
      onlyMatchers : true
    });

    assert.deepEqual(a, [fn1]);
  });

  it('returns matchers', function () {
    var e   = new Emitter();
    var fn1 = noop();
    var fn2 = noop();
    e.addListener('**', fn1);
    e.addListener('a.*', fn2);

    var a = e.listeners('a.b');

    assert.deepEqual(a, [fn1, fn2]);
  });

  it('allows to exclude matchers', function () {
    var e   = new Emitter();
    var fn1 = noop();
    var fn2 = noop();
    e.addListener('**', fn1);
    e.addListener('a.*', fn2);

    var a = e.listeners('a.b', {
      matchers : false
    });

    assert.deepEqual(a, []);
  });

  it('allows to only include matchers', function () {
    var e   = new Emitter();
    var fn1 = noop();
    var fn2 = noop();
    e.addListener('a.*', fn1);
    e.addListener('a.b', fn2);

    var a = e.listeners('a.b', {
      onlyMatchers : true
    });

    assert.deepEqual(a, [fn1]);
  });

});
