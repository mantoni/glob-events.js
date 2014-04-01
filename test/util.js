/*
 * glob-events.js
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';


exports.stub = function stub() {
  function f() {
    f.calls.push({
      scope : this,
      args  : Array.prototype.slice.call(arguments)
    });
  }
  f.calls = [];
  return f;
};

exports.noop = function noop() {
  return function () { return; };
};

exports.noop()(); // coverage
