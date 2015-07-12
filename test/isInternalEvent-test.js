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


describe('isInternalEvent', function () {

  it('throws if event is null', function () {
    var e = new Emitter();

    assert.throws(function () {
      e.isInternalEvent(null);
    }, TypeError);
  });

  it('returns true for "error"', function () {
    var e = new Emitter();

    assert.equal(e.isInternalEvent('error'), true);
  });

  it('returns true for "newListener"', function () {
    var e = new Emitter();

    assert.equal(e.isInternalEvent('newListener'), true);
  });

  it('returns true for "removeListener"', function () {
    var e = new Emitter();

    assert.equal(e.isInternalEvent('removeListener'), true);
  });

  it('returns true for configured addEvent', function () {
    var e = new Emitter({
      addEvent: 'thatEvent'
    });

    assert.equal(e.isInternalEvent('thatEvent'), true);
    assert.equal(e.isInternalEvent('newListener'), false);
  });

  it('returns true for configured removeEvent', function () {
    var e = new Emitter({
      removeEvent: 'thatEvent'
    });

    assert.equal(e.isInternalEvent('thatEvent'), true);
    assert.equal(e.isInternalEvent('removeListener'), false);
  });

  it('returns false for "foo"', function () {
    var e = new Emitter();

    assert.equal(e.isInternalEvent('foo'), false);
  });

  it('returns true for "foo" if configured as internal event', function () {
    var e = new Emitter({
      internalEvents: ['foo']
    });

    assert.equal(e.isInternalEvent('foo'), true);
  });

});
