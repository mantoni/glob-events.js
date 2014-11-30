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
var events = require('../lib/events');
var util = require('./fixture/util');


describe('toScope', function () {

  it('throws if first arg is null', function () {
    assert.throws(function () {
      events.toScope(null);
    }, TypeError);
  });

  it('returns object with event and emtpy args', function () {
    var s = events.toScope(['the.event.name']);

    assert.deepEqual(s, { event : 'the.event.name', args : [] });
  });

  it('adds additional arguments as args', function () {
    var s = events.toScope(['event', 42, true, ['x']]);

    assert.deepEqual(s, { event : 'event', args : [42, true, ['x']] });
  });

  it('returns first arg as scope with additional args', function () {
    var x = { event : 'event' };
    var s = events.toScope([x, 42, true, ['x']]);

    assert.strictEqual(s, x);
    assert.deepEqual(s.args, [42, true, ['x']]);
  });

  it('works with arguments', function () {
    (function () {
      var s = events.toScope(arguments);

      assert.deepEqual(s.args, [42, true, ['x']]);
    }('event', 42, true, ['x']));
  });

});
