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


describe('removeListener', function () {
  var e;

  beforeEach(function () {
    e = new Emitter();
  });

  it('throws if first arg is null', function () {
    assert.throws(function () {
      e.removeListener(null, noop());
    }, TypeError);
  });

  it('throws if second arg is null', function () {
    assert.throws(function () {
      e.removeListener('a.b', null);
    }, TypeError);
  });

  it('removes the given listener', function () {
    var fn1 = noop();
    var fn2 = noop();
    e.addListener('a.b', fn1);
    e.addListener('a.b', fn2);

    e.removeListener('a.b', fn1);

    assert.deepEqual(e.listeners('a.b'), [fn2]);
  });

});
