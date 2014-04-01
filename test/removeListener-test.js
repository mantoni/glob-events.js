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
var util = require('./util');


describe('removeListener', function () {
  var e;

  beforeEach(function () {
    e = new Emitter();
  });

  it('throws if first arg is null', function () {
    assert.throws(function () {
      e.removeListener(null, util.noop());
    }, TypeError);
  });

  it('throws if second arg is null', function () {
    assert.throws(function () {
      e.removeListener('a.b', null);
    }, TypeError);
  });

  it('removes the given listener', function () {
    var fn1 = util.noop();
    var fn2 = util.noop();
    e.addListener('a.b', fn1);
    e.addListener('a.b', fn2);

    e.removeListener('a.b', fn1);

    assert.deepEqual(e.listeners('a.b'), [fn2]);
  });

  it('removes once listener', function () {
    var f = util.stub();
    e.once('a', f);

    e.removeListener('a', f);
    e.emit('a');

    assert(!f.calls.length);
  });

});
