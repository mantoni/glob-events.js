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

function Emitter() {
  this._store = new Store();
}

Emitter.prototype = {

  emit: function (event) {
    if (typeof event !== 'string') {
      throw new TypeError(E_EVENT);
    }
    var a = Array.prototype.slice.call(arguments, 1);
    var i = this._store.iterator(event);
    var fn;
    while ((fn = i.next()) !== undefined) {
      fn.apply(null, a);
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

  listeners: function (name, opts) {
    return this._store.iterator(name, opts).toArray();
  }

};

exports.Emitter = Emitter;
