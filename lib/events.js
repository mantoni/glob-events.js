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


function Emitter(opts) {
  this._store = new Store(opts);
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
    event = scope.event;
    if (typeof event !== 'string') {
      throw new TypeError(E_EVENT);
    }
    if (event === 'error') {
      opts = { matchers : false };
    }
    var i = this._store.iterator(event, opts),
      l = arguments.length,
      a = [],
      j,
      err;
    for (j = 1; j < l; j++) {
      a[j - 1] = arguments[j];
    }
    scope.args = a;
    var o = i.next();
    if (!o) {
      if (event === 'error') {
        throw scope.args[0];
      }
      return;
    }
    do {
      try {
        o.fn.apply(o.scope || scope, a);
      } catch (e) {
        if (event === 'error') {
          err = e;
        } else {
          try {
            this.emit({ event : 'error', cause : scope }, e);
          } catch (ee) {
            err = ee;
          }
        }
      }
    } while ((o = i.next()) !== undefined);
    if (err) {
      throw err;
    }
  },

  addListener: function (event, fn) {
    if (typeof fn !== 'function') {
      throw new TypeError(E_LISTENER);
    }
    var o = { fn : fn };
    if (typeof event !== 'string') {
      o.scope = event.scope;
      o.orig = event.orig;
      event = event.event;
    }
    o.event = event;
    this.emit(EVENT_ADD, event, o.orig || fn);
    this._store.add(event, o);
  },

  once: function (event, fn) {
    if (typeof fn !== 'function') {
      throw new TypeError(E_LISTENER);
    }
    var o = { orig : fn };
    if (typeof event === 'string') {
      o.event = event;
    } else {
      o.event = event.event;
      o.scope = event.scope;
    }
    var s = this;
    this.addListener(o, function () {
      s.removeListener(o.event, fn);
      fn.apply(this, arguments);
    });
  },

  removeListener: function (event, fn) {
    if (typeof event !== 'string') {
      throw new TypeError(E_EVENT);
    }
    if (typeof fn !== 'function') {
      throw new TypeError(E_LISTENER);
    }
    var i = this._store.iterator(event), o;
    while ((o = i.next()) !== undefined) {
      if (o.fn === fn || o.orig === fn) {
        break;
      }
    }
    if (o) {
      this.emit(EVENT_REMOVE, event, o.orig || o.fn);
      this._store.remove(event, o);
    }
  },

  removeAllListeners: function (event) {
    var i = this._store.iterator(event), o;
    while ((o = i.next()) !== undefined) {
      this.emit(EVENT_REMOVE, i.name, o.orig || o.fn);
    }
    this._store.removeAll(event);
  },

  listeners: function (event, opts) {
    var i = this.iterator(event, opts), o, a = [];
    while ((o = i.next()) !== undefined) {
      a.push(o.orig || o.fn);
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
