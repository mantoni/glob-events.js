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
    var opts;
    if (typeof event === 'object') {
      opts  = options(event);
      event = event.event;
    }
    if (typeof event !== 'string') {
      throw new TypeError(E_EVENT);
    }
    var i = this._store.iterator(event, opts), fn, l = arguments.length, a, j;
    if (l > 1) {
      a = [];
      for (j = 1; j < l; j++) {
        a[j - 1] = arguments[j];
      }
      while ((fn = i.next()) !== undefined) {
        fn.apply(null, a);
      }
    } else {
      while ((fn = i.next()) !== undefined) {
        fn();
      }
    }
  },

  addListener: function (name, fn) {
    if (typeof fn !== 'function') {
      throw new TypeError(E_LISTENER);
    }
    this._store.add(name, fn);
  },

  removeListener: function (name, fn) {
    if (typeof fn !== 'function') {
      throw new TypeError(E_LISTENER);
    }
    this._store.remove(name, fn);
  },

  removeAllListeners: function (name) {
    this._store.removeAll(name);
  },

  listeners: function (name, opts) {
    return this._store.iterator(name, options(opts)).toArray();
  }

};

Emitter.prototype.on = Emitter.prototype.addListener;

exports.Emitter = Emitter;
