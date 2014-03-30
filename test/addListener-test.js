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


describe('addListener', function () {
  var e;

  beforeEach(function () {
    e = new Emitter();
  });

  it('throws if first arg is null', function () {
    assert.throws(function () {
      e.addListener(null);
    }, TypeError);
  });

  it('throws if second arg is not a function', function () {
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

});
