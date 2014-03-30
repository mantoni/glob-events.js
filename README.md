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
- `removeListener(event, fn)`: Unregisteres a listener for an event
- `removeAllListeners([event])`: Unregisters all listeners, or all listeners
  for the given event. Matching rules are not applied.
- `listeners([event][, options])`: Returns all listeners, or all listeners
  for the given event. Matching rules are applied on the event name as
  described in the [glob-tree match expressions][]. The options are passed on
  to the [glob-tree iterarator][].

### Emit options

The first argument passed to `emit` can be an object with these properties:

- `event`: The event name
- `matchers`: Emit to matchers, defaults to `true`
- `listeners`: Emit to listeners, defaults to `true`

## TODO

- once(event, fn)
- setMaxListeners(n)
- listenerCount()
- emit newListener events
- emit removeListener events

## License

MIT

[glob-tree match expressions]: https://github.com/mantoni/glob-tree.js#match-expressions
[glob-tree iterator]: https://github.com/mantoni/glob-tree.js#node-api
