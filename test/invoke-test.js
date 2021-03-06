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


describe('invoke', function () {

  it('throws if first arg is null', function () {
    var e = new Emitter();

    assert.throws(function () {
      e.invoke(null);
    }, TypeError);
  });

  it('throws if second arg is missing', function () {
    var e = new Emitter();

    assert.throws(function () {
      e.invoke(e.iterator('*'));
    }, TypeError);
  });

  it('invokes iterator functions with args', function () {
    var e = new Emitter();
    var l1 = util.stub();
    var l2 = util.stub();
    e.addListener('a', l1);
    e.addListener('a', l2);

    e.invoke(e.iterator('a'), { args : [42, { x : 1 }, ['y']] });

    assert.equal(l1.calls.length, 1);
    assert.equal(l2.calls.length, 1);
    assert.deepEqual(l1.calls[0].args, [42, { x : 1 }, ['y']]);
    assert.deepEqual(l2.calls[0].args, [42, { x : 1 }, ['y']]);
  });

  it('passes on custom scope', function () {
    var e = new Emitter();
    var l = util.stub();
    e.addListener('a', l);

    e.invoke(e.iterator('a'), { answer : 42 });

    assert.equal(l.calls[0].scope.answer, 42);
  });

  it('invokes once listener with scope', function () {
    var e = new Emitter();
    var l = util.stub();
    e.once('a', l);

    e.invoke(e.iterator('a'), { answer : 42 });

    assert.equal(l.calls[0].scope.answer, 42);
  });

  it('invokes listener with configured scope', function () {
    var e = new Emitter();
    var l = util.stub();
    var s = {};

    e.addListener({ event : 'a', scope : s }, l);
    e.invoke(e.iterator('a'), {});

    assert.strictEqual(l.calls[0].scope, s);
  });

  it('invokes once listener with configured scope', function () {
    var e = new Emitter();
    var l = util.stub();
    var s = {};

    e.once({ event : 'a', scope : s }, l);
    e.invoke(e.iterator('a'), {});

    assert.strictEqual(l.calls[0].scope, s);
  });

  it('invokes "error" listener with configured scope', function () {
    var e = new Emitter();
    var l = util.stub();
    var s = {};

    e.addListener({ event : 'error', scope : s }, l);
    e.addListener('a', function () { throw new Error(); });
    e.invoke(e.iterator('a'), {});

    assert.strictEqual(l.calls[0].scope, s);
  });

  it('invokes next listener if previous threw', function () {
    var e = new Emitter();
    var error = new Error();
    e.addListener('a', function () {
      throw error;
    });
    var l = util.stub();
    e.addListener('a', l);

    var err;
    try {
      e.invoke(e.iterator('a'), {});
    } catch (e1) {
      err = e1;
    }

    assert.strictEqual(err, error);
    assert.equal(l.calls.length, 1);
  });

  it('invokes a registered "error" listener instead of throwing', function () {
    var e = new Emitter();
    var error = new Error();
    var fn = function () {
      throw error;
    };
    e.addListener('a', fn);
    var l = util.stub();
    e.addListener('error', l);
    var scope = { event : 'a', args : [42, 'xyz'] };

    e.invoke(e.iterator('a'), scope);

    assert.equal(l.calls.length, 1);
    assert.deepEqual(l.calls[0].args, [error]);
    assert.deepEqual(l.calls[0].scope.event, 'error');
    assert.deepEqual(l.calls[0].scope.args, [error]);
    assert.deepEqual(l.calls[0].scope.cause, {
      event : 'a',
      fn    : fn,
      args  : [42, 'xyz'],
      scope : scope
    });
  });

  it('invokes a registered "error" listener on a custom internal emitter',
    function () {
      var i = new Emitter();
      var e = new Emitter({
        internalEmitter : i
      });
      var error = new Error();
      var fn = function () {
        throw error;
      };
      e.addListener('a', fn);
      var l = util.stub();
      i.addListener('error', l);
      var scope = { event : 'a', args : [42, 'xyz'] };

      e.invoke(e.iterator('a'), scope);

      assert.equal(l.calls.length, 1);
      assert.deepEqual(l.calls[0].args, [error]);
      assert.deepEqual(l.calls[0].scope.event, 'error');
      assert.deepEqual(l.calls[0].scope.args, [error]);
      assert.deepEqual(l.calls[0].scope.cause, {
        event : 'a',
        fn    : fn,
        args  : [42, 'xyz'],
        scope : scope
      });
    });

  it('does not count wildcard listeners as "error" handlers', function () {
    var e = new Emitter();
    var error = new Error();
    e.addListener('a', function () {
      throw error;
    });
    var l = util.stub();
    e.addListener('*', l);

    var err;
    try {
      e.invoke(e.iterator('a'), { event : 'a' });
    } catch (e1) {
      err = e1;
    }
    assert.strictEqual(err, error);
    assert.equal(l.calls.length, 1);
    assert.deepEqual(l.calls[0].scope.event, 'a');
  });

  it('throws if event is "error" and no listener is registered', function () {
    var e = new Emitter();
    var err = new Error('Whoups');

    assert.throws(function () {
      e.invoke(e.iterator('nobody'), { event : 'error', args : [err] });
    }, /Whoups/);
  });

  it('detects error in "error" handler', function () {
    var e = new Emitter();
    e.on('error', function () {
      throw new Error('ouch');
    });

    assert.throws(function () {
      e.invoke(e.iterator('error'), { event : 'error', args : [new Error()] });
    }, /ouch/);
  });

  it('exposes args on custom listener scope', function () {
    var e = new Emitter();
    e.on({ event : 'a', scope : {} }, function () {
      assert.deepEqual(this.args, [true, 42]);
    });

    e.invoke(e.iterator('a'), { event : 'a', args : [true, 42] });
  });

  it('does not store args on custom scope', function () {
    var e = new Emitter();
    var o = { event : 'a', scope : {} };
    e.on(o, util.noop());

    e.invoke(e.iterator('a'), { event : 'a', args : [true, 42] });

    assert.equal(o.scope.args, undefined);
  });

});
