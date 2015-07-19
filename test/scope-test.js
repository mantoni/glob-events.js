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

  it('retains custom args property', function () {
    var s = events.toScope([{ event : 'event', args : [42, true, 'abc'] }]);

    assert.deepEqual(s.args, [42, true, 'abc']);
  });

  it('overrides custom args property with new args', function () {
    var s = events.toScope([{ event : 'event', args : [42] }, 'new', 'stuff']);

    assert.deepEqual(s.args, ['new', 'stuff']);
  });

  it('adds object emitter', function () {
    var e = {};
    var s = events.toScope(['event'], e);

    assert.strictEqual(s.emitter, e);
  });

  it('adds null emitter', function () {
    var s = events.toScope(['event'], null);

    assert.strictEqual(s.emitter, null);
  });

  it('adds undefined emitter', function () {
    var s = events.toScope(['event'], undefined);

    assert.strictEqual(s.emitter, undefined);
    assert.equal(s.hasOwnProperty('emitter'), true);
  });

  it('does not add emitter if not given', function () {
    var s = events.toScope(['event']);

    assert.equal(s.hasOwnProperty('emitter'), false);
  });

});
