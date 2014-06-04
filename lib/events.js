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
      fn;
    if (l > 1) {
      var a = [], j;
      for (j = 1; j < l; j++) {
        a[j - 1] = arguments[j];
      }
      scope.args = a;
      while ((fn = i.next()) !== undefined) {
        fn.apply(scope, a);
      }
    } else {
      scope.args = [];
      while ((fn = i.next()) !== undefined) {
        fn.call(scope);
      }
    }
  },

  addListener: function (name, fn) {
    if (typeof fn !== 'function') {
      throw new TypeError(E_LISTENER);
    }
    this.emit(EVENT_ADD, name, fn._once || fn);
    this._store.add(name, fn);
  },

  once: function (name, fn) {
    if (typeof fn !== 'function') {
      throw new TypeError(E_LISTENER);
    }
    var s = this._store;
    var f = function () {
      s.remove(name, f);
      fn.apply(this, arguments);
    };
    f._once = fn;
    this.addListener(name, f);
  },

  removeListener: function (name, fn) {
    if (typeof fn !== 'function') {
      throw new TypeError(E_LISTENER);
    }
    var i = this._store.iterator(name), f;
    while ((f = i.next()) !== undefined) {
      if (f._once === fn) {
        fn = f;
        break;
      }
    }
    this.emit(EVENT_REMOVE, name, fn);
    this._store.remove(name, fn);
  },

  removeAllListeners: function (name) {
    var i = this._store.iterator(name), f;
    while ((f = i.next()) !== undefined) {
      this.emit(EVENT_REMOVE, i.name, f._once || f);
    }
    this._store.removeAll(name);
  },

  listeners: function (name, opts) {
    var i = this.iterator(name, opts), f, a = [];
    while ((f = i.next()) !== undefined) {
      a.push(f._once || f);
    }
    return a;
  },

  iterator: function (name, opts) {
    if (typeof name === 'object') {
      opts = name;
      name = '**';
    }
    return this._store.iterator(name, options(opts));
  }

};

Emitter.prototype.on = Emitter.prototype.addListener;

exports.Emitter = Emitter;
