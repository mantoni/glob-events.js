/*
 * glob-events.js
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var Store = require('glob-store').Store;

var E_LISTENER = 'Listener must be function';
var E_EVENT    = 'Event must be string';
var EVENT_ADD  = {
  event    : 'newListener',
  matchers : false
};
var EVENT_REMOVE = {
  event    : 'removeListener',
  matchers : false
};


function options(opts) {
  return opts ? {
    matchers     : opts.matchers === undefined ? true : opts.matchers,
    onlyMatchers : opts.listeners === undefined ? false : !opts.listeners
  } : null;
}


function Emitter() {
  this._store = new Store();
}

Emitter.prototype = {

  emit: function (event) {
    var opts, scope;
    if (typeof event === 'object') {
      scope = event;
      opts  = options(event);
    } else {
      scope = { event : event };
    }
    if (typeof scope.event !== 'string') {
      throw new TypeError(E_EVENT);
    }
    var i = this._store.iterator(scope.event, opts),
      l = arguments.length,
      fn,
      a = [],
      j,
      err;
    if (l > 1) {
      for (j = 1; j < l; j++) {
        a[j - 1] = arguments[j];
      }
    }
    scope.args = a;
    while ((fn = i.next()) !== undefined) {
      try {
        fn.apply(scope, a);
      } catch (e) {
        err = e;
      }
    }
    if (err) {
      i = this._store.iterator('error', { matchers : false });
      fn = i.next();
      if (!fn) {
        throw err;
      }
      do {
        fn.call(scope, err);
      } while ((fn = i.next()) !== undefined);
    }
  },

  addListener: function (event, fn) {
    if (typeof fn !== 'function') {
      throw new TypeError(E_LISTENER);
    }
    this.emit(EVENT_ADD, event, fn._once || fn);
    this._store.add(event, fn);
  },

  once: function (event, fn) {
    if (typeof fn !== 'function') {
      throw new TypeError(E_LISTENER);
    }
    var s = this._store;
    var f = function () {
      s.remove(event, f);
      fn.apply(this, arguments);
    };
    f._once = fn;
    this.addListener(event, f);
  },

  removeListener: function (event, fn) {
    if (typeof fn !== 'function') {
      throw new TypeError(E_LISTENER);
    }
    var i = this._store.iterator(event), f;
    while ((f = i.next()) !== undefined) {
      if (f._once === fn) {
        fn = f;
        break;
      }
    }
    this.emit(EVENT_REMOVE, event, fn);
    this._store.remove(event, fn);
  },

  removeAllListeners: function (event) {
    var i = this._store.iterator(event), f;
    while ((f = i.next()) !== undefined) {
      this.emit(EVENT_REMOVE, i.name, f._once || f);
    }
    this._store.removeAll(event);
  },

  listeners: function (event, opts) {
    var i = this.iterator(event, opts), f, a = [];
    while ((f = i.next()) !== undefined) {
      a.push(f._once || f);
    }
    return a;
  },

  iterator: function (event, opts) {
    if (typeof event === 'object') {
      opts = event;
      event = '**';
    }
    return this._store.iterator(event, options(opts));
  }

};

Emitter.prototype.on = Emitter.prototype.addListener;

exports.Emitter = Emitter;
