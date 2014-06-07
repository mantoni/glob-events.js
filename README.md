# glob-events.js [![Build Status](https://travis-ci.org/mantoni/glob-events.js.png?branch=master)](http://travis-ci.org/mantoni/glob-events.js)

Event emitter with glob support on event names, for node and the browser

Repository: <https://github.com/mantoni/glob-events.js>

---

## Features

- Node.js EventEmitter compatible API
- Register listeners with glob event names (`*` and `**`)
- Emit events with glob event names (`*` and `**`)
- 100% test coverage

## Install with npm

```
npm install glob-events
```

## Browser support

Use [Browserify](http://browserify.org) to create a standalone file.

## Usage

```js
var Emitter = require('glob-events').Emitter;
var emitter = new Emitter();
```

## Emitter API

- `emit(event[, ...])`: Invokes all listeners registered for the given event
  with the optional arguments. Matching rules are applied on the event name as
  descibed in the [glob-tree match expressions][].
- `addListener(event, fn)` / `on(event, fn)`: Registers a listener for an event
- `once(event, fn)`: Registers a listener for an event that is automatically
  removed on the first invokation
- `removeListener(event, fn)`: Unregisteres a listener for an event
- `removeAllListeners([event])`: Unregisters all listeners, or all listeners
  for the given event. Matching rules are not applied.
- `listeners([event][, options])`: Returns all listeners, or all listeners
  for the given event. Matching rules are applied on the event name as
  described in the [glob-tree match expressions][].
- `iterator([event][, options])`: Exposes the iterator used to retrieve all
  listeners, or all listeners for a given event. Note: When using `once`, the
  function returned by the iterator is not the same as the registered function.

### Options

The `options` argument can have these properties:

- `matchers`: Emit to matchers, defaults to `true`
- `listeners`: Emit to listeners, defaults to `true`

The first argument passed to `emit` can be an object with an `event` property
and any of the above options.

### Scope

Listeners are invoked with a special scope object. If an object is passed to
`emit` as the event (see Options), that object is used as the scope object.
In addition, the arguments array is exposed via `this.args`.

### Events

- `newListener`: Emitted by `addListener`, `on` and `once` with the event name
  and the new listener function. Matchers will not receive this event.
- `removeListener`: Emitted by `removeListener` and `removeAllListeners` with
  the event name and the removed listener function. Matchers will not receive
  this event.
- `error`: Emitted by `emit` if a listener throws an exception. The only
  argument is the caught exception. The scope of the listener is used to expose
  the original event name and arguments (`this.event` and `this.args`).

## TODO

- setMaxListeners(n)

## License

MIT

[glob-tree match expressions]: https://github.com/mantoni/glob-tree.js#match-expressions
