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
var Emitter = require('../lib/events').Emitter;
var util = require('./fixture/util');


describe('emitError', function () {

  it('invokes a registered "error" listener', function () {
    var e = new Emitter();
    var error = new Error();
    var l = util.stub();
    e.addListener('error', l);
    var cause = { event : 'a', args : [42, 'xyz'] };

    e.emitError(error, cause);

    assert.equal(l.calls.length, 1);
    assert.deepEqual(l.calls[0].args, [error]);
    assert.deepEqual(l.calls[0].scope.event, 'error');
    assert.deepEqual(l.calls[0].scope.args, [error]);
    assert.deepEqual(l.calls[0].scope.cause, cause);
  });

});
