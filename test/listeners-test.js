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
  var e;

  beforeEach(function () {
    e = new Emitter();
  });

  it('returns an empty array by default', function () {
    var a = e.listeners();

    assert.deepEqual(a, []);
  });

  it('passes args to iterator', function () {
    e.iterator = util.stub(e.iterator);

    e.listeners('abc', { matchers : false });

    assert.equal(e.iterator.calls.length, 1);
    assert.deepEqual(e.iterator.calls[0].args, ['abc', { matchers : false }]);
  });

  it('returns original once listener', function () {
    var f = util.noop();
    e.once('a', f);

    var a = e.listeners();

    assert.deepEqual(a, [f]);
  });

});
