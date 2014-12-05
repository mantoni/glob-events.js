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

function toScope(args) {
  var event = args[0];
  var scope = typeof event === 'string' ? { event : event } : event;
  event = scope.event;
  if (typeof event !== 'string') {
    throw new TypeError(E_EVENT);
  }
  if (args.length > 1) {
    var l = args.length, a = [], j;
    for (j = 1; j < l; j++) {
      a[j - 1] = args[j];
    }
    scope.args = a;
  } else if (!scope.args) {
    scope.args = [];
  }
  return scope;
}

function ignoreWildcard(fn) {
  return function () {
    if (this.event !== '*') {
      fn.apply(this, arguments);
    }
  };
}


function Emitter(opts) {
  opts = opts || {};
  this._store = new Store(opts);
  this._addEvent = opts.addEvent || 'newListener';
  this._removeEvent = opts.removeEvent || 'removeListener';
}

Emitter.prototype = {

  emit: function () {
    var s = toScope(arguments);
    this.invoke(this.iterator(s.event, s), s);
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
    if (event === this._addEvent || event === this._removeEvent) {
      o.fn = ignoreWildcard(fn);
      o.orig = fn;
    }
    this.emit({
      event    : this._addEvent,
      matchers : false
    }, event, o.orig || fn);
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
      this.emit({
        event    : this._removeEvent,
        matchers : false
      }, event, o.orig || o.fn);
      this._store.remove(event, o);
    }
  },

  removeAllListeners: function (event) {
    var i = this._store.iterator(event), o;
    while ((o = i.next()) !== undefined) {
      this.emit({
        event    : this._removeEvent,
        matchers : false
      }, i.name, o.orig || o.fn);
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
    return this._store.iterator(event, event === 'error'
      ? { matchers : false }
      : options(opts));
  },

  invoke: function (i, scope) {
    var err, o = i.next();
    if (!o) {
      if (scope.event === 'error') {
        throw scope.args[0];
      }
      return;
    }
    do {
      if (o.scope) {
        o.scope.args = scope.args;
      }
      try {
        o.fn.apply(o.scope || scope, scope.args || []);
      } catch (e) {
        if (scope.event === 'error') {
          err = e;
        } else {
          try {
            this.invoke(this.iterator('error'), {
              event   : 'error',
              args    : [e],
              cause   : {
                event : scope.event,
                fn    : o.fn,
                scope : o.scope || scope,
                args  : scope.args || []
              }
            });
          } catch (ee) {
            err = ee;
          }
        }
      } finally {
        if (o.scope) {
          delete o.scope.args;
        }
      }
    } while ((o = i.next()) !== undefined);
    if (err) {
      throw err;
    }
  }

};

Emitter.prototype.on = Emitter.prototype.addListener;

exports.toScope = toScope;
exports.Emitter = Emitter;
