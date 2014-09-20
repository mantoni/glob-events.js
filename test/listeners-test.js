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


describe('listeners', function () {

  it('returns an empty array by default', function () {
    var e = new Emitter();

    var a = e.listeners();

    assert.deepEqual(a, []);
  });

  it('passes args to iterator', function () {
    var e = new Emitter();
    e.iterator = util.stub(e.iterator);

    e.listeners('abc', { matchers : false });

    assert.equal(e.iterator.calls.length, 1);
    assert.deepEqual(e.iterator.calls[0].args, ['abc', { matchers : false }]);
  });

  it('returns original once listener', function () {
    var e = new Emitter();
    var f = util.noop();
    e.once('a', f);

    var a = e.listeners();

    assert.deepEqual(a, [f]);
  });

  it('returns reverse listeners', function () {
    var e = new Emitter({ reverse : true });
    var l1 = util.noop();
    var l2 = util.noop();
    var l3 = util.noop();
    e.addListener('a', l1);
    e.addListener('a', l2);
    e.addListener('a', l3);

    var a = e.listeners('a');

    assert.deepEqual(a, [l3, l2, l1]);
  });

});
