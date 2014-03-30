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


describe('removeAllListeners', function () {
  var e;

  beforeEach(function () {
    e = new Emitter();
  });

  it('removes all listeners if called without args', function () {
    e.addListener('a', noop());
    e.addListener('b.c', noop());

    e.removeAllListeners();

    assert.deepEqual(e.listeners(), []);
  });

  it('removes the named listeners', function () {
    var b = noop();
    e.addListener('a', noop());
    e.addListener('a', noop());
    e.addListener('b', b);

    e.removeAllListeners('a');

    assert.deepEqual(e.listeners(), [b]);
  });

  it('removes only the exact matching listeners', function () {
    var b = noop();
    e.addListener('a.*', noop());
    e.addListener('a.b', b);

    e.removeAllListeners('a.*');

    assert.deepEqual(e.listeners(), [b]);
  });

});
